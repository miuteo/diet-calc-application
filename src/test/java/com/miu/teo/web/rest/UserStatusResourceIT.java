package com.miu.teo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.miu.teo.IntegrationTest;
import com.miu.teo.domain.UserStatus;
import com.miu.teo.repository.UserStatusRepository;
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
 * Integration tests for the {@link UserStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserStatusResourceIT {

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

    private static final String ENTITY_API_URL = "/api/user-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserStatusRepository userStatusRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserStatusMockMvc;

    private UserStatus userStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStatus createEntity(EntityManager em) {
        UserStatus userStatus = new UserStatus()
            .weight(DEFAULT_WEIGHT)
            .proteinNeed(DEFAULT_PROTEIN_NEED)
            .calProteinNeed(DEFAULT_CAL_PROTEIN_NEED)
            .fatNeed(DEFAULT_FAT_NEED)
            .calFatNeed(DEFAULT_CAL_FAT_NEED)
            .carbohydrateNeed(DEFAULT_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(DEFAULT_CAL_CARBOHYDRATE_NEED);
        return userStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserStatus createUpdatedEntity(EntityManager em) {
        UserStatus userStatus = new UserStatus()
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .calProteinNeed(UPDATED_CAL_PROTEIN_NEED)
            .fatNeed(UPDATED_FAT_NEED)
            .calFatNeed(UPDATED_CAL_FAT_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);
        return userStatus;
    }

    @BeforeEach
    public void initTest() {
        userStatus = createEntity(em);
    }

    @Test
    @Transactional
    void createUserStatus() throws Exception {
        int databaseSizeBeforeCreate = userStatusRepository.findAll().size();
        // Create the UserStatus
        restUserStatusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStatus)))
            .andExpect(status().isCreated());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeCreate + 1);
        UserStatus testUserStatus = userStatusList.get(userStatusList.size() - 1);
        assertThat(testUserStatus.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testUserStatus.getProteinNeed()).isEqualTo(DEFAULT_PROTEIN_NEED);
        assertThat(testUserStatus.getCalProteinNeed()).isEqualTo(DEFAULT_CAL_PROTEIN_NEED);
        assertThat(testUserStatus.getFatNeed()).isEqualTo(DEFAULT_FAT_NEED);
        assertThat(testUserStatus.getCalFatNeed()).isEqualTo(DEFAULT_CAL_FAT_NEED);
        assertThat(testUserStatus.getCarbohydrateNeed()).isEqualTo(DEFAULT_CARBOHYDRATE_NEED);
        assertThat(testUserStatus.getCalCarbohydrateNeed()).isEqualTo(DEFAULT_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void createUserStatusWithExistingId() throws Exception {
        // Create the UserStatus with an existing ID
        userStatus.setId(1L);

        int databaseSizeBeforeCreate = userStatusRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserStatusMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStatus)))
            .andExpect(status().isBadRequest());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserStatuses() throws Exception {
        // Initialize the database
        userStatusRepository.saveAndFlush(userStatus);

        // Get all the userStatusList
        restUserStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userStatus.getId().intValue())))
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
    void getUserStatus() throws Exception {
        // Initialize the database
        userStatusRepository.saveAndFlush(userStatus);

        // Get the userStatus
        restUserStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, userStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userStatus.getId().intValue()))
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
    void getNonExistingUserStatus() throws Exception {
        // Get the userStatus
        restUserStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserStatus() throws Exception {
        // Initialize the database
        userStatusRepository.saveAndFlush(userStatus);

        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();

        // Update the userStatus
        UserStatus updatedUserStatus = userStatusRepository.findById(userStatus.getId()).get();
        // Disconnect from session so that the updates on updatedUserStatus are not directly saved in db
        em.detach(updatedUserStatus);
        updatedUserStatus
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .calProteinNeed(UPDATED_CAL_PROTEIN_NEED)
            .fatNeed(UPDATED_FAT_NEED)
            .calFatNeed(UPDATED_CAL_FAT_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);

        restUserStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserStatus))
            )
            .andExpect(status().isOk());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
        UserStatus testUserStatus = userStatusList.get(userStatusList.size() - 1);
        assertThat(testUserStatus.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testUserStatus.getProteinNeed()).isEqualTo(UPDATED_PROTEIN_NEED);
        assertThat(testUserStatus.getCalProteinNeed()).isEqualTo(UPDATED_CAL_PROTEIN_NEED);
        assertThat(testUserStatus.getFatNeed()).isEqualTo(UPDATED_FAT_NEED);
        assertThat(testUserStatus.getCalFatNeed()).isEqualTo(UPDATED_CAL_FAT_NEED);
        assertThat(testUserStatus.getCarbohydrateNeed()).isEqualTo(UPDATED_CARBOHYDRATE_NEED);
        assertThat(testUserStatus.getCalCarbohydrateNeed()).isEqualTo(UPDATED_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void putNonExistingUserStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();
        userStatus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userStatus.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();
        userStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();
        userStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatusMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userStatus)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserStatusWithPatch() throws Exception {
        // Initialize the database
        userStatusRepository.saveAndFlush(userStatus);

        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();

        // Update the userStatus using partial update
        UserStatus partialUpdatedUserStatus = new UserStatus();
        partialUpdatedUserStatus.setId(userStatus.getId());

        partialUpdatedUserStatus
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);

        restUserStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStatus))
            )
            .andExpect(status().isOk());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
        UserStatus testUserStatus = userStatusList.get(userStatusList.size() - 1);
        assertThat(testUserStatus.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testUserStatus.getProteinNeed()).isEqualTo(UPDATED_PROTEIN_NEED);
        assertThat(testUserStatus.getCalProteinNeed()).isEqualTo(DEFAULT_CAL_PROTEIN_NEED);
        assertThat(testUserStatus.getFatNeed()).isEqualTo(DEFAULT_FAT_NEED);
        assertThat(testUserStatus.getCalFatNeed()).isEqualTo(DEFAULT_CAL_FAT_NEED);
        assertThat(testUserStatus.getCarbohydrateNeed()).isEqualTo(UPDATED_CARBOHYDRATE_NEED);
        assertThat(testUserStatus.getCalCarbohydrateNeed()).isEqualTo(UPDATED_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void fullUpdateUserStatusWithPatch() throws Exception {
        // Initialize the database
        userStatusRepository.saveAndFlush(userStatus);

        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();

        // Update the userStatus using partial update
        UserStatus partialUpdatedUserStatus = new UserStatus();
        partialUpdatedUserStatus.setId(userStatus.getId());

        partialUpdatedUserStatus
            .weight(UPDATED_WEIGHT)
            .proteinNeed(UPDATED_PROTEIN_NEED)
            .calProteinNeed(UPDATED_CAL_PROTEIN_NEED)
            .fatNeed(UPDATED_FAT_NEED)
            .calFatNeed(UPDATED_CAL_FAT_NEED)
            .carbohydrateNeed(UPDATED_CARBOHYDRATE_NEED)
            .calCarbohydrateNeed(UPDATED_CAL_CARBOHYDRATE_NEED);

        restUserStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserStatus))
            )
            .andExpect(status().isOk());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
        UserStatus testUserStatus = userStatusList.get(userStatusList.size() - 1);
        assertThat(testUserStatus.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testUserStatus.getProteinNeed()).isEqualTo(UPDATED_PROTEIN_NEED);
        assertThat(testUserStatus.getCalProteinNeed()).isEqualTo(UPDATED_CAL_PROTEIN_NEED);
        assertThat(testUserStatus.getFatNeed()).isEqualTo(UPDATED_FAT_NEED);
        assertThat(testUserStatus.getCalFatNeed()).isEqualTo(UPDATED_CAL_FAT_NEED);
        assertThat(testUserStatus.getCarbohydrateNeed()).isEqualTo(UPDATED_CARBOHYDRATE_NEED);
        assertThat(testUserStatus.getCalCarbohydrateNeed()).isEqualTo(UPDATED_CAL_CARBOHYDRATE_NEED);
    }

    @Test
    @Transactional
    void patchNonExistingUserStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();
        userStatus.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userStatus.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();
        userStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userStatus))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserStatus() throws Exception {
        int databaseSizeBeforeUpdate = userStatusRepository.findAll().size();
        userStatus.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserStatusMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userStatus))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserStatus in the database
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserStatus() throws Exception {
        // Initialize the database
        userStatusRepository.saveAndFlush(userStatus);

        int databaseSizeBeforeDelete = userStatusRepository.findAll().size();

        // Delete the userStatus
        restUserStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, userStatus.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserStatus> userStatusList = userStatusRepository.findAll();
        assertThat(userStatusList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
