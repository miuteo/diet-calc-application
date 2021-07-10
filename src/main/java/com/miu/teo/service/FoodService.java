package com.miu.teo.service;

import com.miu.teo.domain.Food;
import com.miu.teo.domain.Meal;
import com.miu.teo.domain.User;
import com.miu.teo.domain.enumeration.MealName;
import com.miu.teo.repository.FoodRepository;
import com.miu.teo.repository.MealRepository;
import com.miu.teo.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class FoodService {

    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final MealService mealService;
    private final MealRepository mealRepository;

    public FoodService(
        UserRepository userRepository,
        FoodRepository foodRepository,
        MealService mealService,
        MealRepository mealRepository
    ) {
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.mealService = mealService;
        this.mealRepository = mealRepository;
    }

    @Transactional
    public Food createFood(String login, Food food) {
        food.di(Instant.now());
        List<Meal> mealList = mealService.findTodayMeals();
        if (mealList != null && !mealList.isEmpty()) food.setMeal(mealList.get(0)); else {
            Meal meal = new Meal()
                .mealTime(MealName.MORNING)
                .di(Instant.now())
                .user(userRepository.findOneByLogin(login).orElseThrow(UserNotFounException::new));
            food.setMeal(mealRepository.save(meal));
        }

        return foodRepository.save(food);
    }
}
