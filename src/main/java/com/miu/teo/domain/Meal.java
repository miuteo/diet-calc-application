package com.miu.teo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.miu.teo.domain.enumeration.MealName;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Meal.
 */
@Entity
@Table(name = "meal")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Meal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_time")
    private MealName mealTime;

    @OneToMany(mappedBy = "meal")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "meal" }, allowSetters = true)
    private Set<Food> foods = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Meal id(Long id) {
        this.id = id;
        return this;
    }

    public MealName getMealTime() {
        return this.mealTime;
    }

    public Meal mealTime(MealName mealTime) {
        this.mealTime = mealTime;
        return this;
    }

    public void setMealTime(MealName mealTime) {
        this.mealTime = mealTime;
    }

    public Set<Food> getFoods() {
        return this.foods;
    }

    public Meal foods(Set<Food> foods) {
        this.setFoods(foods);
        return this;
    }

    public Meal addFood(Food food) {
        this.foods.add(food);
        food.setMeal(this);
        return this;
    }

    public Meal removeFood(Food food) {
        this.foods.remove(food);
        food.setMeal(null);
        return this;
    }

    public void setFoods(Set<Food> foods) {
        if (this.foods != null) {
            this.foods.forEach(i -> i.setMeal(null));
        }
        if (foods != null) {
            foods.forEach(i -> i.setMeal(this));
        }
        this.foods = foods;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Meal)) {
            return false;
        }
        return id != null && id.equals(((Meal) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Meal{" +
            "id=" + getId() +
            ", mealTime='" + getMealTime() + "'" +
            "}";
    }
}
