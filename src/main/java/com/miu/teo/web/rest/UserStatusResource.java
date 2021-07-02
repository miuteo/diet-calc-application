package com.miu.teo.web.rest;

import com.miu.teo.domain.UserStatus;
import com.miu.teo.repository.UserStatusRepository;
import com.miu.teo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.miu.teo.domain.UserStatus}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserStatusResource {

    private final Logger log = LoggerFactory.getLogger(UserStatusResource.class);

    private static final String ENTITY_NAME = "userStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserStatusRepository userStatusRepository;

    public UserStatusResource(UserStatusRepository userStatusRepository) {
        this.userStatusRepository = userStatusRepository;
    }

    /**
     * {@code POST  /user-statuses} : Create a new userStatus.
     *
     * @param userStatus the userStatus to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userStatus, or with status {@code 400 (Bad Request)} if the userStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-statuses")
    public ResponseEntity<UserStatus> createUserStatus(@RequestBody UserStatus userStatus) throws URISyntaxException {
        log.debug("REST request to save UserStatus : {}", userStatus);
        if (userStatus.getId() != null) {
            throw new BadRequestAlertException("A new userStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserStatus result = userStatusRepository.save(userStatus);
        return ResponseEntity
            .created(new URI("/api/user-statuses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-statuses/:id} : Updates an existing userStatus.
     *
     * @param id the id of the userStatus to save.
     * @param userStatus the userStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStatus,
     * or with status {@code 400 (Bad Request)} if the userStatus is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-statuses/{id}")
    public ResponseEntity<UserStatus> updateUserStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserStatus userStatus
    ) throws URISyntaxException {
        log.debug("REST request to update UserStatus : {}, {}", id, userStatus);
        if (userStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserStatus result = userStatusRepository.save(userStatus);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userStatus.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-statuses/:id} : Partial updates given fields of an existing userStatus, field will ignore if it is null
     *
     * @param id the id of the userStatus to save.
     * @param userStatus the userStatus to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userStatus,
     * or with status {@code 400 (Bad Request)} if the userStatus is not valid,
     * or with status {@code 404 (Not Found)} if the userStatus is not found,
     * or with status {@code 500 (Internal Server Error)} if the userStatus couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-statuses/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<UserStatus> partialUpdateUserStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserStatus userStatus
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserStatus partially : {}, {}", id, userStatus);
        if (userStatus.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userStatus.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserStatus> result = userStatusRepository
            .findById(userStatus.getId())
            .map(
                existingUserStatus -> {
                    if (userStatus.getWeight() != null) {
                        existingUserStatus.setWeight(userStatus.getWeight());
                    }
                    if (userStatus.getProteinNeed() != null) {
                        existingUserStatus.setProteinNeed(userStatus.getProteinNeed());
                    }
                    if (userStatus.getCalProteinNeed() != null) {
                        existingUserStatus.setCalProteinNeed(userStatus.getCalProteinNeed());
                    }
                    if (userStatus.getFatNeed() != null) {
                        existingUserStatus.setFatNeed(userStatus.getFatNeed());
                    }
                    if (userStatus.getCalFatNeed() != null) {
                        existingUserStatus.setCalFatNeed(userStatus.getCalFatNeed());
                    }
                    if (userStatus.getCarbohydrateNeed() != null) {
                        existingUserStatus.setCarbohydrateNeed(userStatus.getCarbohydrateNeed());
                    }
                    if (userStatus.getCalCarbohydrateNeed() != null) {
                        existingUserStatus.setCalCarbohydrateNeed(userStatus.getCalCarbohydrateNeed());
                    }

                    return existingUserStatus;
                }
            )
            .map(userStatusRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userStatus.getId().toString())
        );
    }

    /**
     * {@code GET  /user-statuses} : get all the userStatuses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userStatuses in body.
     */
    @GetMapping("/user-statuses")
    public List<UserStatus> getAllUserStatuses() {
        log.debug("REST request to get all UserStatuses");
        return userStatusRepository.findAll();
    }

    /**
     * {@code GET  /user-statuses/:id} : get the "id" userStatus.
     *
     * @param id the id of the userStatus to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userStatus, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-statuses/{id}")
    public ResponseEntity<UserStatus> getUserStatus(@PathVariable Long id) {
        log.debug("REST request to get UserStatus : {}", id);
        Optional<UserStatus> userStatus = userStatusRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userStatus);
    }

    /**
     * {@code DELETE  /user-statuses/:id} : delete the "id" userStatus.
     *
     * @param id the id of the userStatus to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-statuses/{id}")
    public ResponseEntity<Void> deleteUserStatus(@PathVariable Long id) {
        log.debug("REST request to delete UserStatus : {}", id);
        userStatusRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
