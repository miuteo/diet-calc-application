package com.miu.teo.service;

import com.miu.teo.domain.Meal;
import com.miu.teo.domain.User;
import com.miu.teo.repository.MealRepository;
import com.miu.teo.repository.UserRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MealService {

    private final UserRepository userRepository;
    private final MealRepository mealRepository;

    public MealService(UserRepository userRepository, MealRepository mealRepository) {
        this.userRepository = userRepository;
        this.mealRepository = mealRepository;
    }

    public Meal createMeal(String login, Meal meal) {
        User user = userRepository.findOneByLogin(login).orElseThrow(UserNotFounException::new);
        meal.user(user).di(Instant.now());
        return mealRepository.save(meal);
    }

    public List<Meal> findTodayMeals() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        return mealRepository.findTodayMeals(start.toInstant(ZoneOffset.UTC), end.toInstant(ZoneOffset.UTC));
    }
}
