package com.miu.teo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Food.
 */
@Entity
@Table(name = "food")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Food implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "di")
    private Instant di;

    @Column(name = "quantity")
    private Integer quantity;

    @ManyToOne
    @JsonIgnoreProperties(value = { "foods" }, allowSetters = true)
    private Meal meal;

    @ManyToOne(optional = false)
    @NotNull
    private FoodNutritionalValue foodNutritionalValue;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Food id(Long id) {
        this.id = id;
        return this;
    }

    public Instant getDi() {
        return this.di;
    }

    public Food di(Instant di) {
        this.di = di;
        return this;
    }

    public void setDi(Instant di) {
        this.di = di;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public Food quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Meal getMeal() {
        return this.meal;
    }

    public Food meal(Meal meal) {
        this.setMeal(meal);
        return this;
    }

    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    public FoodNutritionalValue getFoodNutritionalValue() {
        return this.foodNutritionalValue;
    }

    public Food foodNutritionalValue(FoodNutritionalValue foodNutritionalValue) {
        this.setFoodNutritionalValue(foodNutritionalValue);
        return this;
    }

    public void setFoodNutritionalValue(FoodNutritionalValue foodNutritionalValue) {
        this.foodNutritionalValue = foodNutritionalValue;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Food)) {
            return false;
        }
        return id != null && id.equals(((Food) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Food{" +
            "id=" + getId() +
            ", di='" + getDi() + "'" +
            ", quantity=" + getQuantity() +
            "}";
    }
}
