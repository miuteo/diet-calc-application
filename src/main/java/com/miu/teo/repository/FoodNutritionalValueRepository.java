package com.miu.teo.repository;

import com.miu.teo.domain.FoodNutritionalValue;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FoodNutritionalValue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodNutritionalValueRepository extends JpaRepository<FoodNutritionalValue, Long> {
    FoodNutritionalValue findFirstByIsProteinPowder(boolean isProteinPowder);
}
