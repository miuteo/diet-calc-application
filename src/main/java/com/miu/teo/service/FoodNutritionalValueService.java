package com.miu.teo.service;

import com.miu.teo.domain.FoodNutritionalValue;
import com.miu.teo.repository.FoodNutritionalValueRepository;
import com.miu.teo.service.dto.FoodNutritionalCustomDTO;
import com.miu.teo.service.dto.IngredientCustomDTO;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class FoodNutritionalValueService {

    private final FoodNutritionalValueRepository foodNutritionalValueRepository;

    public FoodNutritionalValueService(FoodNutritionalValueRepository foodNutritionalValueRepository) {
        this.foodNutritionalValueRepository = foodNutritionalValueRepository;
    }

    @Transactional
    public FoodNutritionalValue createFoodNutritionalValue(FoodNutritionalCustomDTO foodNutritionalCustomDTO) {
        FoodNutritionalValue foodNutritionalValue = convertToFoodNutritionalValue(foodNutritionalCustomDTO);
        return foodNutritionalValueRepository.save(foodNutritionalValue);
    }

    private FoodNutritionalValue convertToFoodNutritionalValue(FoodNutritionalCustomDTO foodNutritionalCustomDTO) {
        FoodNutritionalValue foodNutritionalComputed = new FoodNutritionalValue();
        foodNutritionalComputed.setDi(Instant.now());
        foodNutritionalComputed.setName(foodNutritionalCustomDTO.getName());
        foodNutritionalComputed.setCarbohydrate(0D);
        foodNutritionalComputed.setProtein(0D);
        foodNutritionalComputed.setFat(0D);
        foodNutritionalComputed.setIsProteinPowder(false);
        foodNutritionalComputed.setQuantity(foodNutritionalCustomDTO.getResulted());

        List<FoodNutritionalValue> ingredientsList = foodNutritionalValueRepository.findByIdIn(
            foodNutritionalCustomDTO.getIngredientList().stream().map(IngredientCustomDTO::getId).collect(Collectors.toList())
        );
        if (ingredientsList.size() != foodNutritionalCustomDTO.getIngredientList().size()) throw new RuntimeException(
            "Expected " + foodNutritionalCustomDTO.getIngredientList().size() + " but got " + +ingredientsList.size() + "ingredientList"
        );

        Map<Long, Double> ingredientWeightMap = foodNutritionalCustomDTO
            .getIngredientList()
            .stream()
            .collect(Collectors.toMap(IngredientCustomDTO::getId, IngredientCustomDTO::getWeight));

        ingredientsList.forEach(
            ingredient -> addMacroNutritionalValues(foodNutritionalComputed, ingredient, ingredientWeightMap.get(ingredient.getId()))
        );

        return foodNutritionalComputed;
    }

    private void addMacroNutritionalValues(
        FoodNutritionalValue foodNutritionalComputed,
        FoodNutritionalValue ingredient,
        double ingredientWeight
    ) {
        addMacro(
            foodNutritionalComputed::setProtein,
            foodNutritionalComputed::getProtein,
            ingredient::getProtein,
            ingredient,
            ingredientWeight
        );
        addMacro(foodNutritionalComputed::setFat, foodNutritionalComputed::getFat, ingredient::getFat, ingredient, ingredientWeight);
        addMacro(
            foodNutritionalComputed::setCarbohydrate,
            foodNutritionalComputed::getCarbohydrate,
            ingredient::getCarbohydrate,
            ingredient,
            ingredientWeight
        );
    }

    private void addMacro(
        Consumer<Double> setter,
        Supplier<Double> getter,
        Supplier<Double> ingredientGetter,
        FoodNutritionalValue ingredient,
        double ingredientWeight
    ) {
        setter.accept(getter.get() + extractMacroNutrient(ingredientGetter.get(), ingredient, ingredientWeight));
    }

    private double extractMacroNutrient(double macroNutrient, FoodNutritionalValue ingredient, double ingredientWeight) {
        return ingredientWeight / ingredient.getQuantity() * macroNutrient;
    }
}
