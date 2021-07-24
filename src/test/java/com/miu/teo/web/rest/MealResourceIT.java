package com.miu.teo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.miu.teo.IntegrationTest;
import com.miu.teo.domain.Meal;
import com.miu.teo.domain.User;
import com.miu.teo.domain.enumeration.MealName;
import com.miu.teo.repository.MealRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MealResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MealResourceIT {

    private static final MealName DEFAULT_MEAL_TIME = MealName.MORNING;
    private static final MealName UPDATED_MEAL_TIME = MealName.PRELAUNCH;

    private static final Instant DEFAULT_DI = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DI = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/meals";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMealMockMvc;

    private Meal meal;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Meal createEntity(EntityManager em) {
        Meal meal = new Meal().mealTime(DEFAULT_MEAL_TIME).di(DEFAULT_DI);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        meal.setUser(user);
        return meal;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Meal createUpdatedEntity(EntityManager em) {
        Meal meal = new Meal().mealTime(UPDATED_MEAL_TIME).di(UPDATED_DI);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        meal.setUser(user);
        return meal;
    }

    @BeforeEach
    public void initTest() {
        meal = createEntity(em);
    }

    @Test
    @Transactional
    void createMeal() throws Exception {
        int databaseSizeBeforeCreate = mealRepository.findAll().size();
        Instant beforeCreate = Instant.now();
        // Create the Meal
        restMealMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meal)))
            .andExpect(status().isCreated());

        Instant afterCreate = Instant.now();
        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeCreate + 1);
        Meal testMeal = mealList.get(mealList.size() - 1);
        assertThat(testMeal.getMealTime()).isEqualTo(DEFAULT_MEAL_TIME);
        assertThat(testMeal.getDi()).isBetween(beforeCreate, afterCreate);
    }

    @Test
    @Transactional
    void createMealWithExistingId() throws Exception {
        // Create the Meal with an existing ID
        meal.setId(1L);

        int databaseSizeBeforeCreate = mealRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMealMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meal)))
            .andExpect(status().isBadRequest());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDiIsRequired() throws Exception {
        int databaseSizeBeforeTest = mealRepository.findAll().size();
        // set the field null
        meal.setDi(null);

        // Create the Meal, which fails.

        restMealMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meal)))
            .andExpect(status().isBadRequest());

        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMeals() throws Exception {
        // Initialize the database
        Instant now = Instant.now();
        meal.setDi(now);
        mealRepository.saveAndFlush(meal);

        // Get all the mealList
        restMealMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(meal.getId().intValue())))
            .andExpect(jsonPath("$.[*].mealTime").value(hasItem(DEFAULT_MEAL_TIME.toString())))
            .andExpect(jsonPath("$.[*].di").value(hasItem(now.toString())));
    }

    @Test
    @Transactional
    void getMeal() throws Exception {
        // Initialize the database
        mealRepository.saveAndFlush(meal);

        // Get the meal
        restMealMockMvc
            .perform(get(ENTITY_API_URL_ID, meal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(meal.getId().intValue()))
            .andExpect(jsonPath("$.mealTime").value(DEFAULT_MEAL_TIME.toString()))
            .andExpect(jsonPath("$.di").value(DEFAULT_DI.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMeal() throws Exception {
        // Get the meal
        restMealMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMeal() throws Exception {
        // Initialize the database
        mealRepository.saveAndFlush(meal);

        int databaseSizeBeforeUpdate = mealRepository.findAll().size();

        // Update the meal
        Meal updatedMeal = mealRepository.findById(meal.getId()).get();
        // Disconnect from session so that the updates on updatedMeal are not directly saved in db
        em.detach(updatedMeal);
        updatedMeal.mealTime(UPDATED_MEAL_TIME).di(UPDATED_DI);

        restMealMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMeal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMeal))
            )
            .andExpect(status().isOk());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
        Meal testMeal = mealList.get(mealList.size() - 1);
        assertThat(testMeal.getMealTime()).isEqualTo(UPDATED_MEAL_TIME);
        assertThat(testMeal.getDi()).isEqualTo(UPDATED_DI);
    }

    @Test
    @Transactional
    void putNonExistingMeal() throws Exception {
        int databaseSizeBeforeUpdate = mealRepository.findAll().size();
        meal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMealMockMvc
            .perform(
                put(ENTITY_API_URL_ID, meal.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMeal() throws Exception {
        int databaseSizeBeforeUpdate = mealRepository.findAll().size();
        meal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMealMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(meal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMeal() throws Exception {
        int databaseSizeBeforeUpdate = mealRepository.findAll().size();
        meal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMealMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(meal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMealWithPatch() throws Exception {
        // Initialize the database
        mealRepository.saveAndFlush(meal);

        int databaseSizeBeforeUpdate = mealRepository.findAll().size();

        // Update the meal using partial update
        Meal partialUpdatedMeal = new Meal();
        partialUpdatedMeal.setId(meal.getId());

        partialUpdatedMeal.mealTime(UPDATED_MEAL_TIME);

        restMealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeal))
            )
            .andExpect(status().isOk());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
        Meal testMeal = mealList.get(mealList.size() - 1);
        assertThat(testMeal.getMealTime()).isEqualTo(UPDATED_MEAL_TIME);
        assertThat(testMeal.getDi()).isEqualTo(DEFAULT_DI);
    }

    @Test
    @Transactional
    void fullUpdateMealWithPatch() throws Exception {
        // Initialize the database
        mealRepository.saveAndFlush(meal);

        int databaseSizeBeforeUpdate = mealRepository.findAll().size();

        // Update the meal using partial update
        Meal partialUpdatedMeal = new Meal();
        partialUpdatedMeal.setId(meal.getId());

        partialUpdatedMeal.mealTime(UPDATED_MEAL_TIME).di(UPDATED_DI);

        restMealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMeal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMeal))
            )
            .andExpect(status().isOk());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
        Meal testMeal = mealList.get(mealList.size() - 1);
        assertThat(testMeal.getMealTime()).isEqualTo(UPDATED_MEAL_TIME);
        assertThat(testMeal.getDi()).isEqualTo(UPDATED_DI);
    }

    @Test
    @Transactional
    void patchNonExistingMeal() throws Exception {
        int databaseSizeBeforeUpdate = mealRepository.findAll().size();
        meal.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, meal.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMeal() throws Exception {
        int databaseSizeBeforeUpdate = mealRepository.findAll().size();
        meal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMealMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(meal))
            )
            .andExpect(status().isBadRequest());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMeal() throws Exception {
        int databaseSizeBeforeUpdate = mealRepository.findAll().size();
        meal.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMealMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(meal)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Meal in the database
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMeal() throws Exception {
        // Initialize the database
        mealRepository.saveAndFlush(meal);

        int databaseSizeBeforeDelete = mealRepository.findAll().size();

        // Delete the meal
        restMealMockMvc
            .perform(delete(ENTITY_API_URL_ID, meal.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Meal> mealList = mealRepository.findAll();
        assertThat(mealList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
