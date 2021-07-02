package com.miu.teo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.miu.teo.IntegrationTest;
import com.miu.teo.domain.UserDetails;
import com.miu.teo.repository.UserDetailsRepository;
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
 * Integration tests for the {@link UserDetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserDetailsResourceIT {

    private static final Double DEFAULT_WEIGHT = 1D;
    private static final Double UPDATED_WEIGHT = 2D;

    private static final Integer DEFAULT_PROTEIN_NEED = 1;
    private static final Integer UPDATED_PROTEIN_NEED = 2;

    private static final Integer DEFAULT_CAL_PROTEIN_NEED = 1;
    private static final Integer UPDATED_CAL_PROTEIN_NEED = 2;

    private static final Integer DEFAULT_FAT_NEED = 1;
    private static final Integer UPDATED_FAT_NEED = 2;

    private static final Integer DEFAULT_CAL_FAT_NEED = 1;
    private static final Integer UPDATED_CAL_FAT_NEED = 2;

    private static final Integer DEFAULT_CARBOHYDRATE_NEED = 1;
    private static final Integer UPDATED_CARBOHYDRATE_NEED = 2;

    private static final Integer DEFAULT_CAL_CARBOHYDRATE_NEED = 1;
    private static final Integer UPDATED_CAL_CARBOHYDRATE_NEED = 2;

    private static final String ENTITY_API_URL = "/api/user-details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserDetailsMockMvc;

    private UserDetails userDetails;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserDetails createEntity(EntityManager em) {
        UserDetails userDetails = new UserDetails()
            .weight(DEFAULT_WEIGHT)
            .proteinNeed(DEFAULT_PROTEIN_NEED)
            .calProteinNeed(DEFAULT_CAL_PROTEIN_NEED)
            .fatNeed(DEFAULT_FAT_NEED)
            .calFatNeed(DEFAULT_CAL_FAT_NEED)
            .carbohydrateNeed(DEFAULT_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(DEFAULT_CAL_CARBOHYDRATE_NEED);
        return userDetails;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserDetails createUpdatedEntity(EntityManager em) {
        UserDetails userDetails = new UserDetails()
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .calProteinNeed(UPDATED_CAL_PROTEIN_NEED)
            .fatNeed(UPDATED_FAT_NEED)
            .calFatNeed(UPDATED_CAL_FAT_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);
        return userDetails;
    }

    @BeforeEach
    public void initTest() {
        userDetails = createEntity(em);
    }

    @Test
    @Transactional
    void createUserDetails() throws Exception {
        int databaseSizeBeforeCreate = userDetailsRepository.findAll().size();
        // Create the UserDetails
        restUserDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userDetails)))
            .andExpect(status().isCreated());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        UserDetails testUserDetails = userDetailsList.get(userDetailsList.size() - 1);
        assertThat(testUserDetails.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testUserDetails.getProteinNeed()).isEqualTo(DEFAULT_PROTEIN_NEED);
        assertThat(testUserDetails.getCalProteinNeed()).isEqualTo(DEFAULT_CAL_PROTEIN_NEED);
        assertThat(testUserDetails.getFatNeed()).isEqualTo(DEFAULT_FAT_NEED);
        assertThat(testUserDetails.getCalFatNeed()).isEqualTo(DEFAULT_CAL_FAT_NEED);
        assertThat(testUserDetails.getCarbohydrateNeed()).isEqualTo(DEFAULT_CARBOHYDRATE_NEED);
        assertThat(testUserDetails.getCalCarbohydrateNeed()).isEqualTo(DEFAULT_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void createUserDetailsWithExistingId() throws Exception {
        // Create the UserDetails with an existing ID
        userDetails.setId(1L);

        int databaseSizeBeforeCreate = userDetailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userDetails)))
            .andExpect(status().isBadRequest());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserDetails() throws Exception {
        // Initialize the database
        userDetailsRepository.saveAndFlush(userDetails);

        // Get all the userDetailsList
        restUserDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userDetails.getId().intValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].proteinNeed").value(hasItem(DEFAULT_PROTEIN_NEED)))
            .andExpect(jsonPath("$.[*].calProteinNeed").value(hasItem(DEFAULT_CAL_PROTEIN_NEED)))
            .andExpect(jsonPath("$.[*].fatNeed").value(hasItem(DEFAULT_FAT_NEED)))
            .andExpect(jsonPath("$.[*].calFatNeed").value(hasItem(DEFAULT_CAL_FAT_NEED)))
            .andExpect(jsonPath("$.[*].carbohydrateNeed").value(hasItem(DEFAULT_CARBOHYDRATE_NEED)))
            .andExpect(jsonPath("$.[*].calCarbohydrateNeed").value(hasItem(DEFAULT_CAL_CARBOHYDRATE_NEED)));
    }

    @Test
    @Transactional
    void getUserDetails() throws Exception {
        // Initialize the database
        userDetailsRepository.saveAndFlush(userDetails);

        // Get the userDetails
        restUserDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, userDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userDetails.getId().intValue()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()))
            .andExpect(jsonPath("$.proteinNeed").value(DEFAULT_PROTEIN_NEED))
            .andExpect(jsonPath("$.calProteinNeed").value(DEFAULT_CAL_PROTEIN_NEED))
            .andExpect(jsonPath("$.fatNeed").value(DEFAULT_FAT_NEED))
            .andExpect(jsonPath("$.calFatNeed").value(DEFAULT_CAL_FAT_NEED))
            .andExpect(jsonPath("$.carbohydrateNeed").value(DEFAULT_CARBOHYDRATE_NEED))
            .andExpect(jsonPath("$.calCarbohydrateNeed").value(DEFAULT_CAL_CARBOHYDRATE_NEED));
    }

    @Test
    @Transactional
    void getNonExistingUserDetails() throws Exception {
        // Get the userDetails
        restUserDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserDetails() throws Exception {
        // Initialize the database
        userDetailsRepository.saveAndFlush(userDetails);

        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();

        // Update the userDetails
        UserDetails updatedUserDetails = userDetailsRepository.findById(userDetails.getId()).get();
        // Disconnect from session so that the updates on updatedUserDetails are not directly saved in db
        em.detach(updatedUserDetails);
        updatedUserDetails
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .calProteinNeed(UPDATED_CAL_PROTEIN_NEED)
            .fatNeed(UPDATED_FAT_NEED)
            .calFatNeed(UPDATED_CAL_FAT_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);

        restUserDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserDetails))
            )
            .andExpect(status().isOk());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
        UserDetails testUserDetails = userDetailsList.get(userDetailsList.size() - 1);
        assertThat(testUserDetails.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testUserDetails.getProteinNeed()).isEqualTo(UPDATED_PROTEIN_NEED);
        assertThat(testUserDetails.getCalProteinNeed()).isEqualTo(UPDATED_CAL_PROTEIN_NEED);
        assertThat(testUserDetails.getFatNeed()).isEqualTo(UPDATED_FAT_NEED);
        assertThat(testUserDetails.getCalFatNeed()).isEqualTo(UPDATED_CAL_FAT_NEED);
        assertThat(testUserDetails.getCarbohydrateNeed()).isEqualTo(UPDATED_CARBOHYDRATE_NEED);
        assertThat(testUserDetails.getCalCarbohydrateNeed()).isEqualTo(UPDATED_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void putNonExistingUserDetails() throws Exception {
        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();
        userDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserDetails() throws Exception {
        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();
        userDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserDetails() throws Exception {
        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();
        userDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDetailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userDetails)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserDetailsWithPatch() throws Exception {
        // Initialize the database
        userDetailsRepository.saveAndFlush(userDetails);

        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();

        // Update the userDetails using partial update
        UserDetails partialUpdatedUserDetails = new UserDetails();
        partialUpdatedUserDetails.setId(userDetails.getId());

        partialUpdatedUserDetails
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .calProteinNeed(UPDATED_CAL_PROTEIN_NEED)
            .calFatNeed(UPDATED_CAL_FAT_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);

        restUserDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserDetails))
            )
            .andExpect(status().isOk());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
        UserDetails testUserDetails = userDetailsList.get(userDetailsList.size() - 1);
        assertThat(testUserDetails.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testUserDetails.getProteinNeed()).isEqualTo(UPDATED_PROTEIN_NEED);
        assertThat(testUserDetails.getCalProteinNeed()).isEqualTo(UPDATED_CAL_PROTEIN_NEED);
        assertThat(testUserDetails.getFatNeed()).isEqualTo(DEFAULT_FAT_NEED);
        assertThat(testUserDetails.getCalFatNeed()).isEqualTo(UPDATED_CAL_FAT_NEED);
        assertThat(testUserDetails.getCarbohydrateNeed()).isEqualTo(UPDATED_CARBOHYDRATE_NEED);
        assertThat(testUserDetails.getCalCarbohydrateNeed()).isEqualTo(UPDATED_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void fullUpdateUserDetailsWithPatch() throws Exception {
        // Initialize the database
        userDetailsRepository.saveAndFlush(userDetails);

        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();

        // Update the userDetails using partial update
        UserDetails partialUpdatedUserDetails = new UserDetails();
        partialUpdatedUserDetails.setId(userDetails.getId());

        partialUpdatedUserDetails
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .calProteinNeed(UPDATED_CAL_PROTEIN_NEED)
            .fatNeed(UPDATED_FAT_NEED)
            .calFatNeed(UPDATED_CAL_FAT_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);

        restUserDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserDetails))
            )
            .andExpect(status().isOk());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
        UserDetails testUserDetails = userDetailsList.get(userDetailsList.size() - 1);
        assertThat(testUserDetails.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testUserDetails.getProteinNeed()).isEqualTo(UPDATED_PROTEIN_NEED);
        assertThat(testUserDetails.getCalProteinNeed()).isEqualTo(UPDATED_CAL_PROTEIN_NEED);
        assertThat(testUserDetails.getFatNeed()).isEqualTo(UPDATED_FAT_NEED);
        assertThat(testUserDetails.getCalFatNeed()).isEqualTo(UPDATED_CAL_FAT_NEED);
        assertThat(testUserDetails.getCarbohydrateNeed()).isEqualTo(UPDATED_CARBOHYDRATE_NEED);
        assertThat(testUserDetails.getCalCarbohydrateNeed()).isEqualTo(UPDATED_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void patchNonExistingUserDetails() throws Exception {
        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();
        userDetails.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserDetails() throws Exception {
        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();
        userDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userDetails))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserDetails() throws Exception {
        int databaseSizeBeforeUpdate = userDetailsRepository.findAll().size();
        userDetails.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userDetails))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserDetails in the database
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserDetails() throws Exception {
        // Initialize the database
        userDetailsRepository.saveAndFlush(userDetails);

        int databaseSizeBeforeDelete = userDetailsRepository.findAll().size();

        // Delete the userDetails
        restUserDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, userDetails.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserDetails> userDetailsList = userDetailsRepository.findAll();
        assertThat(userDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
