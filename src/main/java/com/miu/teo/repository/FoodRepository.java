package com.miu.teo.repository;

import com.miu.teo.domain.Food;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Food entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    @Query("select food from Food food where food.di between ?1 and ?2 and food.meal.user.login = ?#{principal.username}")
    List<Food> findTodayFoods(Instant start, Instant end);
}
