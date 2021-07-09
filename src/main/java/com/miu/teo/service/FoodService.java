package com.miu.teo.service;

import com.miu.teo.domain.Food;
import com.miu.teo.domain.User;
import com.miu.teo.repository.FoodRepository;
import com.miu.teo.repository.UserRepository;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class FoodService {

    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    public FoodService(UserRepository userRepository, FoodRepository foodRepository) {
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
    }

    public Food createFood(String login, Food food) {
        User user = userRepository.findOneByLogin(login).orElseThrow(UserNotFounException::new);
        food.di(Instant.now());
        return foodRepository.save(food);
    }
}
