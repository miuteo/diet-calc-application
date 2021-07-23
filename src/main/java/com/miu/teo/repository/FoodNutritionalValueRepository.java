package com.miu.teo.repository;

import com.miu.teo.domain.FoodNutritionalValue;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FoodNutritionalValue entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodNutritionalValueRepository extends JpaRepository<FoodNutritionalValue, Long> {
    FoodNutritionalValue findFirstByIsProteinPowder(boolean isProteinPowder);

    List<FoodNutritionalValue> findByIdIn(Collection<Long> idList);
}
