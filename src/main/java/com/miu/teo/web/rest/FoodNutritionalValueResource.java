package com.miu.teo.web.rest;

import com.miu.teo.domain.FoodNutritionalValue;
import com.miu.teo.repository.FoodNutritionalValueRepository;
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
 * REST controller for managing {@link com.miu.teo.domain.FoodNutritionalValue}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FoodNutritionalValueResource {

    private final Logger log = LoggerFactory.getLogger(FoodNutritionalValueResource.class);

    private static final String ENTITY_NAME = "foodNutritionalValue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FoodNutritionalValueRepository foodNutritionalValueRepository;

    public FoodNutritionalValueResource(FoodNutritionalValueRepository foodNutritionalValueRepository) {
        this.foodNutritionalValueRepository = foodNutritionalValueRepository;
    }

    /**
     * {@code POST  /food-nutritional-values} : Create a new foodNutritionalValue.
     *
     * @param foodNutritionalValue the foodNutritionalValue to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new foodNutritionalValue, or with status {@code 400 (Bad Request)} if the foodNutritionalValue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/food-nutritional-values")
    public ResponseEntity<FoodNutritionalValue> createFoodNutritionalValue(@RequestBody FoodNutritionalValue foodNutritionalValue)
        throws URISyntaxException {
        log.debug("REST request to save FoodNutritionalValue : {}", foodNutritionalValue);
        if (foodNutritionalValue.getId() != null) {
            throw new BadRequestAlertException("A new foodNutritionalValue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FoodNutritionalValue result = foodNutritionalValueRepository.save(foodNutritionalValue);
        return ResponseEntity
            .created(new URI("/api/food-nutritional-values/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /food-nutritional-values/:id} : Updates an existing foodNutritionalValue.
     *
     * @param id the id of the foodNutritionalValue to save.
     * @param foodNutritionalValue the foodNutritionalValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foodNutritionalValue,
     * or with status {@code 400 (Bad Request)} if the foodNutritionalValue is not valid,
     * or with status {@code 500 (Internal Server Error)} if the foodNutritionalValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/food-nutritional-values/{id}")
    public ResponseEntity<FoodNutritionalValue> updateFoodNutritionalValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FoodNutritionalValue foodNutritionalValue
    ) throws URISyntaxException {
        log.debug("REST request to update FoodNutritionalValue : {}, {}", id, foodNutritionalValue);
        if (foodNutritionalValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foodNutritionalValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodNutritionalValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FoodNutritionalValue result = foodNutritionalValueRepository.save(foodNutritionalValue);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, foodNutritionalValue.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /food-nutritional-values/:id} : Partial updates given fields of an existing foodNutritionalValue, field will ignore if it is null
     *
     * @param id the id of the foodNutritionalValue to save.
     * @param foodNutritionalValue the foodNutritionalValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated foodNutritionalValue,
     * or with status {@code 400 (Bad Request)} if the foodNutritionalValue is not valid,
     * or with status {@code 404 (Not Found)} if the foodNutritionalValue is not found,
     * or with status {@code 500 (Internal Server Error)} if the foodNutritionalValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/food-nutritional-values/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FoodNutritionalValue> partialUpdateFoodNutritionalValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FoodNutritionalValue foodNutritionalValue
    ) throws URISyntaxException {
        log.debug("REST request to partial update FoodNutritionalValue partially : {}, {}", id, foodNutritionalValue);
        if (foodNutritionalValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, foodNutritionalValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!foodNutritionalValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FoodNutritionalValue> result = foodNutritionalValueRepository
            .findById(foodNutritionalValue.getId())
            .map(
                existingFoodNutritionalValue -> {
                    if (foodNutritionalValue.getDi() != null) {
                        existingFoodNutritionalValue.setDi(foodNutritionalValue.getDi());
                    }
                    if (foodNutritionalValue.getBarcode() != null) {
                        existingFoodNutritionalValue.setBarcode(foodNutritionalValue.getBarcode());
                    }
                    if (foodNutritionalValue.getProtein() != null) {
                        existingFoodNutritionalValue.setProtein(foodNutritionalValue.getProtein());
                    }
                    if (foodNutritionalValue.getProteinCal() != null) {
                        existingFoodNutritionalValue.setProteinCal(foodNutritionalValue.getProteinCal());
                    }
                    if (foodNutritionalValue.getFat() != null) {
                        existingFoodNutritionalValue.setFat(foodNutritionalValue.getFat());
                    }
                    if (foodNutritionalValue.getFatCal() != null) {
                        existingFoodNutritionalValue.setFatCal(foodNutritionalValue.getFatCal());
                    }
                    if (foodNutritionalValue.getCarbohydrate() != null) {
                        existingFoodNutritionalValue.setCarbohydrate(foodNutritionalValue.getCarbohydrate());
                    }
                    if (foodNutritionalValue.getCarbohydrateCal() != null) {
                        existingFoodNutritionalValue.setCarbohydrateCal(foodNutritionalValue.getCarbohydrateCal());
                    }
                    if (foodNutritionalValue.getQuantity() != null) {
                        existingFoodNutritionalValue.setQuantity(foodNutritionalValue.getQuantity());
                    }
                    if (foodNutritionalValue.getIsProteinPowder() != null) {
                        existingFoodNutritionalValue.setIsProteinPowder(foodNutritionalValue.getIsProteinPowder());
                    }

                    return existingFoodNutritionalValue;
                }
            )
            .map(foodNutritionalValueRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, foodNutritionalValue.getId().toString())
        );
    }

    /**
     * {@code GET  /food-nutritional-values} : get all the foodNutritionalValues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of foodNutritionalValues in body.
     */
    @GetMapping("/food-nutritional-values")
    public List<FoodNutritionalValue> getAllFoodNutritionalValues() {
        log.debug("REST request to get all FoodNutritionalValues");
        return foodNutritionalValueRepository.findAll();
    }

    /**
     * {@code GET  /food-nutritional-values/:id} : get the "id" foodNutritionalValue.
     *
     * @param id the id of the foodNutritionalValue to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the foodNutritionalValue, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/food-nutritional-values/{id}")
    public ResponseEntity<FoodNutritionalValue> getFoodNutritionalValue(@PathVariable Long id) {
        log.debug("REST request to get FoodNutritionalValue : {}", id);
        Optional<FoodNutritionalValue> foodNutritionalValue = foodNutritionalValueRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(foodNutritionalValue);
    }

    /**
     * {@code DELETE  /food-nutritional-values/:id} : delete the "id" foodNutritionalValue.
     *
     * @param id the id of the foodNutritionalValue to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/food-nutritional-values/{id}")
    public ResponseEntity<Void> deleteFoodNutritionalValue(@PathVariable Long id) {
        log.debug("REST request to delete FoodNutritionalValue : {}", id);
        foodNutritionalValueRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
