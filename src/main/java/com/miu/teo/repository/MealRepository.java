package com.miu.teo.repository;

import com.miu.teo.domain.Meal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Meal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    @Query("select meal from Meal meal where meal.user.login=?#{principal.username}")
    List<Meal> findMealByUserIsCurrentUser();

    @Query("select meal from Meal meal where meal.di between ?1 and ?2 and meal.user.login=?#{principal.username}")
    List<Meal> findTodayMeals(Instant start, Instant end);
}
