package com.miu.teo.service.dto;

import java.util.List;

public class FoodNutritionalCustomDTO {

    private String name;

    private Double resulted;

    private List<IngredientCustomDTO> ingredientList;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getResulted() {
        return resulted;
    }

    public void setResulted(Double resulted) {
        this.resulted = resulted;
    }

    public List<IngredientCustomDTO> getIngredientList() {
        return ingredientList;
    }

    public void setIngredientList(List<IngredientCustomDTO> ingredientList) {
        this.ingredientList = ingredientList;
    }

    @Override
    public String toString() {
        return "FoodNutritionalCustomDTO{" + "name='" + name + '\'' + ", resulted=" + resulted + ", ingredientList=" + ingredientList + '}';
    }
}
