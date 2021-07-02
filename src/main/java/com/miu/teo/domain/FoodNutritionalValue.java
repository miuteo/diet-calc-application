package com.miu.teo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FoodNutritionalValue.
 */
@Entity
@Table(name = "food_nutritional_value")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FoodNutritionalValue implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "di")
    private Instant di;

    @Column(name = "name")
    private String name;

    @Column(name = "protein")
    private Double protein;

    @Column(name = "protein_cal")
    private Double proteinCal;

    @Column(name = "fat")
    private Double fat;

    @Column(name = "fat_cal")
    private Double fatCal;

    @Column(name = "carbohydrate")
    private Double carbohydrate;

    @Column(name = "carbohydrate_cal")
    private Double carbohydrateCal;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "is_protein_powder")
    private Boolean isProteinPowder;

    @ManyToOne
    @JsonIgnoreProperties(value = { "meal" }, allowSetters = true)
    private Food foodNutritionalValue;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FoodNutritionalValue id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getDi() {
        return this.di;
    }

    public FoodNutritionalValue di(Instant di) {
        this.di = di;
        return this;
    }

    public void setDi(Instant di) {
        this.di = di;
    }

    public String getName() {
        return this.name;
    }

    public FoodNutritionalValue name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getProtein() {
        return this.protein;
    }

    public FoodNutritionalValue protein(Double protein) {
        this.protein = protein;
        return this;
    }

    public void setProtein(Double protein) {
        this.protein = protein;
    }

    public Double getProteinCal() {
        return this.proteinCal;
    }

    public FoodNutritionalValue proteinCal(Double proteinCal) {
        this.proteinCal = proteinCal;
        return this;
    }

    public void setProteinCal(Double proteinCal) {
        this.proteinCal = proteinCal;
    }

    public Double getFat() {
        return this.fat;
    }

    public FoodNutritionalValue fat(Double fat) {
        this.fat = fat;
        return this;
    }

    public void setFat(Double fat) {
        this.fat = fat;
    }

    public Double getFatCal() {
        return this.fatCal;
    }

    public FoodNutritionalValue fatCal(Double fatCal) {
        this.fatCal = fatCal;
        return this;
    }

    public void setFatCal(Double fatCal) {
        this.fatCal = fatCal;
    }

    public Double getCarbohydrate() {
        return this.carbohydrate;
    }

    public FoodNutritionalValue carbohydrate(Double carbohydrate) {
        this.carbohydrate = carbohydrate;
        return this;
    }

    public void setCarbohydrate(Double carbohydrate) {
        this.carbohydrate = carbohydrate;
    }

    public Double getCarbohydrateCal() {
        return this.carbohydrateCal;
    }

    public FoodNutritionalValue carbohydrateCal(Double carbohydrateCal) {
        this.carbohydrateCal = carbohydrateCal;
        return this;
    }

    public void setCarbohydrateCal(Double carbohydrateCal) {
        this.carbohydrateCal = carbohydrateCal;
    }

    public Double getQuantity() {
        return this.quantity;
    }

    public FoodNutritionalValue quantity(Double quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Boolean getIsProteinPowder() {
        return this.isProteinPowder;
    }

    public FoodNutritionalValue isProteinPowder(Boolean isProteinPowder) {
        this.isProteinPowder = isProteinPowder;
        return this;
    }

    public void setIsProteinPowder(Boolean isProteinPowder) {
        this.isProteinPowder = isProteinPowder;
    }

    public Food getFoodNutritionalValue() {
        return this.foodNutritionalValue;
    }

    public FoodNutritionalValue foodNutritionalValue(Food food) {
        this.setFoodNutritionalValue(food);
        return this;
    }

    public void setFoodNutritionalValue(Food food) {
        this.foodNutritionalValue = food;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FoodNutritionalValue)) {
            return false;
        }
        return id != null && id.equals(((FoodNutritionalValue) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FoodNutritionalValue{" +
            "id=" + getId() +
            ", di='" + getDi() + "'" +
            ", name='" + getName() + "'" +
            ", protein=" + getProtein() +
            ", proteinCal=" + getProteinCal() +
            ", fat=" + getFat() +
            ", fatCal=" + getFatCal() +
            ", carbohydrate=" + getCarbohydrate() +
            ", carbohydrateCal=" + getCarbohydrateCal() +
            ", quantity=" + getQuantity() +
            ", isProteinPowder='" + getIsProteinPowder() + "'" +
            "}";
    }
}
