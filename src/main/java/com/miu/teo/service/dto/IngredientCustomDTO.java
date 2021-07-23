package com.miu.teo.service.dto;

public class IngredientCustomDTO {

    private Long id;
    private Double weight;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    @Override
    public String toString() {
        return "IngredientCustomDTO{" + "id=" + id + ", weight=" + weight + '}';
    }
}
