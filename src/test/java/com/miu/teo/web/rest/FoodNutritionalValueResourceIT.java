package com.miu.teo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.miu.teo.IntegrationTest;
import com.miu.teo.domain.FoodNutritionalValue;
import com.miu.teo.repository.FoodNutritionalValueRepository;
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
 * Integration tests for the {@link FoodNutritionalValueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FoodNutritionalValueResourceIT {

    private static final Instant DEFAULT_DI = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DI = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_PROTEIN = 1D;
    private static final Double UPDATED_PROTEIN = 2D;

    private static final Double DEFAULT_PROTEIN_CAL = 1D;
    private static final Double UPDATED_PROTEIN_CAL = 2D;

    private static final Double DEFAULT_FAT = 1D;
    private static final Double UPDATED_FAT = 2D;

    private static final Double DEFAULT_FAT_CAL = 1D;
    private static final Double UPDATED_FAT_CAL = 2D;

    private static final Double DEFAULT_CARBOHYDRATE = 1D;
    private static final Double UPDATED_CARBOHYDRATE = 2D;

    private static final Double DEFAULT_CARBOHYDRATE_CAL = 1D;
    private static final Double UPDATED_CARBOHYDRATE_CAL = 2D;

    private static final Double DEFAULT_QUANTITY = 1D;
    private static final Double UPDATED_QUANTITY = 2D;

    private static final Boolean DEFAULT_IS_PROTEIN_POWDER = false;
    private static final Boolean UPDATED_IS_PROTEIN_POWDER = true;

    private static final String ENTITY_API_URL = "/api/food-nutritional-values";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FoodNutritionalValueRepository foodNutritionalValueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFoodNutritionalValueMockMvc;

    private FoodNutritionalValue foodNutritionalValue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FoodNutritionalValue createEntity(EntityManager em) {
        FoodNutritionalValue foodNutritionalValue = new FoodNutritionalValue()
            .di(DEFAULT_DI)
            .name(DEFAULT_NAME)
            .protein(DEFAULT_PROTEIN)
            .proteinCal(DEFAULT_PROTEIN_CAL)
            .fat(DEFAULT_FAT)
            .fatCal(DEFAULT_FAT_CAL)
            .carbohydrate(DEFAULT_CARBOHYDRATE)
            .carbohydrateCal(DEFAULT_CARBOHYDRATE_CAL)
            .quantity(DEFAULT_QUANTITY)
            .isProteinPowder(DEFAULT_IS_PROTEIN_POWDER);
        return foodNutritionalValue;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FoodNutritionalValue createUpdatedEntity(EntityManager em) {
        FoodNutritionalValue foodNutritionalValue = new FoodNutritionalValue()
            .di(UPDATED_DI)
            .name(UPDATED_NAME)
            .protein(UPDATED_PROTEIN)
            .proteinCal(UPDATED_PROTEIN_CAL)
            .fat(UPDATED_FAT)
            .fatCal(UPDATED_FAT_CAL)
            .carbohydrate(UPDATED_CARBOHYDRATE)
            .carbohydrateCal(UPDATED_CARBOHYDRATE_CAL)
            .quantity(UPDATED_QUANTITY)
            .isProteinPowder(UPDATED_IS_PROTEIN_POWDER);
        return foodNutritionalValue;
    }

    @BeforeEach
    public void initTest() {
        foodNutritionalValue = createEntity(em);
    }

    @Test
    @Transactional
    void createFoodNutritionalValue() throws Exception {
        int databaseSizeBeforeCreate = foodNutritionalValueRepository.findAll().size();
        // Create the FoodNutritionalValue
        restFoodNutritionalValueMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isCreated());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeCreate + 1);
        FoodNutritionalValue testFoodNutritionalValue = foodNutritionalValueList.get(foodNutritionalValueList.size() - 1);
        assertThat(testFoodNutritionalValue.getDi()).isNotEqualTo(DEFAULT_DI).isNotNull();
        assertThat(testFoodNutritionalValue.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFoodNutritionalValue.getProtein()).isEqualTo(DEFAULT_PROTEIN);
        assertThat(testFoodNutritionalValue.getProteinCal()).isEqualTo(DEFAULT_PROTEIN_CAL);
        assertThat(testFoodNutritionalValue.getFat()).isEqualTo(DEFAULT_FAT);
        assertThat(testFoodNutritionalValue.getFatCal()).isEqualTo(DEFAULT_FAT_CAL);
        assertThat(testFoodNutritionalValue.getCarbohydrate()).isEqualTo(DEFAULT_CARBOHYDRATE);
        assertThat(testFoodNutritionalValue.getCarbohydrateCal()).isEqualTo(DEFAULT_CARBOHYDRATE_CAL);
        assertThat(testFoodNutritionalValue.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testFoodNutritionalValue.getIsProteinPowder()).isEqualTo(DEFAULT_IS_PROTEIN_POWDER);
    }

    @Test
    @Transactional
    void createFoodNutritionalValueWithExistingId() throws Exception {
        // Create the FoodNutritionalValue with an existing ID
        foodNutritionalValue.setId(1L);

        int databaseSizeBeforeCreate = foodNutritionalValueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFoodNutritionalValueMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFoodNutritionalValues() throws Exception {
        // Initialize the database
        foodNutritionalValueRepository.saveAndFlush(foodNutritionalValue);

        // Get all the foodNutritionalValueList
        restFoodNutritionalValueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(foodNutritionalValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].di").value(hasItem(DEFAULT_DI.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].protein").value(hasItem(DEFAULT_PROTEIN.doubleValue())))
            .andExpect(jsonPath("$.[*].proteinCal").value(hasItem(DEFAULT_PROTEIN_CAL.doubleValue())))
            .andExpect(jsonPath("$.[*].fat").value(hasItem(DEFAULT_FAT.doubleValue())))
            .andExpect(jsonPath("$.[*].fatCal").value(hasItem(DEFAULT_FAT_CAL.doubleValue())))
            .andExpect(jsonPath("$.[*].carbohydrate").value(hasItem(DEFAULT_CARBOHYDRATE.doubleValue())))
            .andExpect(jsonPath("$.[*].carbohydrateCal").value(hasItem(DEFAULT_CARBOHYDRATE_CAL.doubleValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY.doubleValue())))
            .andExpect(jsonPath("$.[*].isProteinPowder").value(hasItem(DEFAULT_IS_PROTEIN_POWDER.booleanValue())));
    }

    @Test
    @Transactional
    void getFoodNutritionalValue() throws Exception {
        // Initialize the database
        foodNutritionalValueRepository.saveAndFlush(foodNutritionalValue);

        // Get the foodNutritionalValue
        restFoodNutritionalValueMockMvc
            .perform(get(ENTITY_API_URL_ID, foodNutritionalValue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(foodNutritionalValue.getId().intValue()))
            .andExpect(jsonPath("$.di").value(DEFAULT_DI.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.protein").value(DEFAULT_PROTEIN.doubleValue()))
            .andExpect(jsonPath("$.proteinCal").value(DEFAULT_PROTEIN_CAL.doubleValue()))
            .andExpect(jsonPath("$.fat").value(DEFAULT_FAT.doubleValue()))
            .andExpect(jsonPath("$.fatCal").value(DEFAULT_FAT_CAL.doubleValue()))
            .andExpect(jsonPath("$.carbohydrate").value(DEFAULT_CARBOHYDRATE.doubleValue()))
            .andExpect(jsonPath("$.carbohydrateCal").value(DEFAULT_CARBOHYDRATE_CAL.doubleValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY.doubleValue()))
            .andExpect(jsonPath("$.isProteinPowder").value(DEFAULT_IS_PROTEIN_POWDER.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingFoodNutritionalValue() throws Exception {
        // Get the foodNutritionalValue
        restFoodNutritionalValueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFoodNutritionalValue() throws Exception {
        // Initialize the database
        foodNutritionalValueRepository.saveAndFlush(foodNutritionalValue);

        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();

        // Update the foodNutritionalValue
        FoodNutritionalValue updatedFoodNutritionalValue = foodNutritionalValueRepository.findById(foodNutritionalValue.getId()).get();
        // Disconnect from session so that the updates on updatedFoodNutritionalValue are not directly saved in db
        em.detach(updatedFoodNutritionalValue);
        updatedFoodNutritionalValue
            .di(UPDATED_DI)
            .name(UPDATED_NAME)
            .protein(UPDATED_PROTEIN)
            .proteinCal(UPDATED_PROTEIN_CAL)
            .fat(UPDATED_FAT)
            .fatCal(UPDATED_FAT_CAL)
            .carbohydrate(UPDATED_CARBOHYDRATE)
            .carbohydrateCal(UPDATED_CARBOHYDRATE_CAL)
            .quantity(UPDATED_QUANTITY)
            .isProteinPowder(UPDATED_IS_PROTEIN_POWDER);

        restFoodNutritionalValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFoodNutritionalValue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFoodNutritionalValue))
            )
            .andExpect(status().isOk());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
        FoodNutritionalValue testFoodNutritionalValue = foodNutritionalValueList.get(foodNutritionalValueList.size() - 1);
        assertThat(testFoodNutritionalValue.getDi()).isEqualTo(UPDATED_DI);
        assertThat(testFoodNutritionalValue.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFoodNutritionalValue.getProtein()).isEqualTo(UPDATED_PROTEIN);
        assertThat(testFoodNutritionalValue.getProteinCal()).isEqualTo(UPDATED_PROTEIN_CAL);
        assertThat(testFoodNutritionalValue.getFat()).isEqualTo(UPDATED_FAT);
        assertThat(testFoodNutritionalValue.getFatCal()).isEqualTo(UPDATED_FAT_CAL);
        assertThat(testFoodNutritionalValue.getCarbohydrate()).isEqualTo(UPDATED_CARBOHYDRATE);
        assertThat(testFoodNutritionalValue.getCarbohydrateCal()).isEqualTo(UPDATED_CARBOHYDRATE_CAL);
        assertThat(testFoodNutritionalValue.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testFoodNutritionalValue.getIsProteinPowder()).isEqualTo(UPDATED_IS_PROTEIN_POWDER);
    }

    @Test
    @Transactional
    void putNonExistingFoodNutritionalValue() throws Exception {
        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();
        foodNutritionalValue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFoodNutritionalValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, foodNutritionalValue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFoodNutritionalValue() throws Exception {
        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();
        foodNutritionalValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodNutritionalValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFoodNutritionalValue() throws Exception {
        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();
        foodNutritionalValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodNutritionalValueMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFoodNutritionalValueWithPatch() throws Exception {
        // Initialize the database
        foodNutritionalValueRepository.saveAndFlush(foodNutritionalValue);

        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();

        // Update the foodNutritionalValue using partial update
        FoodNutritionalValue partialUpdatedFoodNutritionalValue = new FoodNutritionalValue();
        partialUpdatedFoodNutritionalValue.setId(foodNutritionalValue.getId());

        partialUpdatedFoodNutritionalValue
            .di(UPDATED_DI)
            .name(UPDATED_NAME)
            .protein(UPDATED_PROTEIN)
            .proteinCal(UPDATED_PROTEIN_CAL)
            .fat(UPDATED_FAT)
            .carbohydrateCal(UPDATED_CARBOHYDRATE_CAL);

        restFoodNutritionalValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFoodNutritionalValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFoodNutritionalValue))
            )
            .andExpect(status().isOk());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
        FoodNutritionalValue testFoodNutritionalValue = foodNutritionalValueList.get(foodNutritionalValueList.size() - 1);
        assertThat(testFoodNutritionalValue.getDi()).isEqualTo(UPDATED_DI);
        assertThat(testFoodNutritionalValue.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFoodNutritionalValue.getProtein()).isEqualTo(UPDATED_PROTEIN);
        assertThat(testFoodNutritionalValue.getProteinCal()).isEqualTo(UPDATED_PROTEIN_CAL);
        assertThat(testFoodNutritionalValue.getFat()).isEqualTo(UPDATED_FAT);
        assertThat(testFoodNutritionalValue.getFatCal()).isEqualTo(DEFAULT_FAT_CAL);
        assertThat(testFoodNutritionalValue.getCarbohydrate()).isEqualTo(DEFAULT_CARBOHYDRATE);
        assertThat(testFoodNutritionalValue.getCarbohydrateCal()).isEqualTo(UPDATED_CARBOHYDRATE_CAL);
        assertThat(testFoodNutritionalValue.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testFoodNutritionalValue.getIsProteinPowder()).isEqualTo(DEFAULT_IS_PROTEIN_POWDER);
    }

    @Test
    @Transactional
    void fullUpdateFoodNutritionalValueWithPatch() throws Exception {
        // Initialize the database
        foodNutritionalValueRepository.saveAndFlush(foodNutritionalValue);

        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();

        // Update the foodNutritionalValue using partial update
        FoodNutritionalValue partialUpdatedFoodNutritionalValue = new FoodNutritionalValue();
        partialUpdatedFoodNutritionalValue.setId(foodNutritionalValue.getId());

        partialUpdatedFoodNutritionalValue
            .di(UPDATED_DI)
            .name(UPDATED_NAME)
            .protein(UPDATED_PROTEIN)
            .proteinCal(UPDATED_PROTEIN_CAL)
            .fat(UPDATED_FAT)
            .fatCal(UPDATED_FAT_CAL)
            .carbohydrate(UPDATED_CARBOHYDRATE)
            .carbohydrateCal(UPDATED_CARBOHYDRATE_CAL)
            .quantity(UPDATED_QUANTITY)
            .isProteinPowder(UPDATED_IS_PROTEIN_POWDER);

        restFoodNutritionalValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFoodNutritionalValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFoodNutritionalValue))
            )
            .andExpect(status().isOk());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
        FoodNutritionalValue testFoodNutritionalValue = foodNutritionalValueList.get(foodNutritionalValueList.size() - 1);
        assertThat(testFoodNutritionalValue.getDi()).isEqualTo(UPDATED_DI);
        assertThat(testFoodNutritionalValue.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFoodNutritionalValue.getProtein()).isEqualTo(UPDATED_PROTEIN);
        assertThat(testFoodNutritionalValue.getProteinCal()).isEqualTo(UPDATED_PROTEIN_CAL);
        assertThat(testFoodNutritionalValue.getFat()).isEqualTo(UPDATED_FAT);
        assertThat(testFoodNutritionalValue.getFatCal()).isEqualTo(UPDATED_FAT_CAL);
        assertThat(testFoodNutritionalValue.getCarbohydrate()).isEqualTo(UPDATED_CARBOHYDRATE);
        assertThat(testFoodNutritionalValue.getCarbohydrateCal()).isEqualTo(UPDATED_CARBOHYDRATE_CAL);
        assertThat(testFoodNutritionalValue.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testFoodNutritionalValue.getIsProteinPowder()).isEqualTo(UPDATED_IS_PROTEIN_POWDER);
    }

    @Test
    @Transactional
    void patchNonExistingFoodNutritionalValue() throws Exception {
        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();
        foodNutritionalValue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFoodNutritionalValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, foodNutritionalValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFoodNutritionalValue() throws Exception {
        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();
        foodNutritionalValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodNutritionalValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFoodNutritionalValue() throws Exception {
        int databaseSizeBeforeUpdate = foodNutritionalValueRepository.findAll().size();
        foodNutritionalValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFoodNutritionalValueMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(foodNutritionalValue))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FoodNutritionalValue in the database
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFoodNutritionalValue() throws Exception {
        // Initialize the database
        foodNutritionalValueRepository.saveAndFlush(foodNutritionalValue);

        int databaseSizeBeforeDelete = foodNutritionalValueRepository.findAll().size();

        // Delete the foodNutritionalValue
        restFoodNutritionalValueMockMvc
            .perform(delete(ENTITY_API_URL_ID, foodNutritionalValue.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FoodNutritionalValue> foodNutritionalValueList = foodNutritionalValueRepository.findAll();
        assertThat(foodNutritionalValueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
