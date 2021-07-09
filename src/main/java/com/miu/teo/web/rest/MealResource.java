package com.miu.teo.web.rest;

import com.miu.teo.domain.Meal;
import com.miu.teo.repository.MealRepository;
import com.miu.teo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.miu.teo.domain.Meal}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MealResource {

    private final Logger log = LoggerFactory.getLogger(MealResource.class);

    private static final String ENTITY_NAME = "meal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MealRepository mealRepository;

    public MealResource(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    /**
     * {@code POST  /meals} : Create a new meal.
     *
     * @param meal the meal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new meal, or with status {@code 400 (Bad Request)} if the meal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/meals")
    public ResponseEntity<Meal> createMeal(@Valid @RequestBody Meal meal) throws URISyntaxException {
        log.debug("REST request to save Meal : {}", meal);
        if (meal.getId() != null) {
            throw new BadRequestAlertException("A new meal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Meal result = mealRepository.save(meal);
        return ResponseEntity
            .created(new URI("/api/meals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /meals/:id} : Updates an existing meal.
     *
     * @param id the id of the meal to save.
     * @param meal the meal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meal,
     * or with status {@code 400 (Bad Request)} if the meal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the meal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/meals/{id}")
    public ResponseEntity<Meal> updateMeal(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Meal meal)
        throws URISyntaxException {
        log.debug("REST request to update Meal : {}, {}", id, meal);
        if (meal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mealRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Meal result = mealRepository.save(meal);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, meal.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /meals/:id} : Partial updates given fields of an existing meal, field will ignore if it is null
     *
     * @param id the id of the meal to save.
     * @param meal the meal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated meal,
     * or with status {@code 400 (Bad Request)} if the meal is not valid,
     * or with status {@code 404 (Not Found)} if the meal is not found,
     * or with status {@code 500 (Internal Server Error)} if the meal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/meals/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Meal> partialUpdateMeal(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Meal meal
    ) throws URISyntaxException {
        log.debug("REST request to partial update Meal partially : {}, {}", id, meal);
        if (meal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, meal.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mealRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Meal> result = mealRepository
            .findById(meal.getId())
            .map(
                existingMeal -> {
                    if (meal.getMealTime() != null) {
                        existingMeal.setMealTime(meal.getMealTime());
                    }
                    if (meal.getDi() != null) {
                        existingMeal.setDi(meal.getDi());
                    }

                    return existingMeal;
                }
            )
            .map(mealRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, meal.getId().toString())
        );
    }

    /**
     * {@code GET  /meals} : get all the meals.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of meals in body.
     */
    @GetMapping("/meals")
    public List<Meal> getAllMeals() {
        log.debug("REST request to get all Meals");
        return mealRepository.findAll();
    }

    /**
     * {@code GET  /meals/:id} : get the "id" meal.
     *
     * @param id the id of the meal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the meal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/meals/{id}")
    public ResponseEntity<Meal> getMeal(@PathVariable Long id) {
        log.debug("REST request to get Meal : {}", id);
        Optional<Meal> meal = mealRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(meal);
    }

    /**
     * {@code DELETE  /meals/:id} : delete the "id" meal.
     *
     * @param id the id of the meal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/meals/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        log.debug("REST request to delete Meal : {}", id);
        mealRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
