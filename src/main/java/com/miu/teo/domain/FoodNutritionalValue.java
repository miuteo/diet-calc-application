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

    @Column(name = "barcode")
    private String barcode;

    @Column(name = "protein")
    private Integer protein;

    @Column(name = "protein_cal")
    private Integer proteinCal;

    @Column(name = "fat")
    private Integer fat;

    @Column(name = "fat_cal")
    private Integer fatCal;

    @Column(name = "carbohydrate")
    private Integer carbohydrate;

    @Column(name = "carbohydrate_cal")
    private Integer carbohydrateCal;

    @Column(name = "quantity")
    private Integer quantity;

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

    public String getBarcode() {
        return this.barcode;
    }

    public FoodNutritionalValue barcode(String barcode) {
        this.barcode = barcode;
        return this;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public Integer getProtein() {
        return this.protein;
    }

    public FoodNutritionalValue protein(Integer protein) {
        this.protein = protein;
        return this;
    }

    public void setProtein(Integer protein) {
        this.protein = protein;
    }

    public Integer getProteinCal() {
        return this.proteinCal;
    }

    public FoodNutritionalValue proteinCal(Integer proteinCal) {
        this.proteinCal = proteinCal;
        return this;
    }

    public void setProteinCal(Integer proteinCal) {
        this.proteinCal = proteinCal;
    }

    public Integer getFat() {
        return this.fat;
    }

    public FoodNutritionalValue fat(Integer fat) {
        this.fat = fat;
        return this;
    }

    public void setFat(Integer fat) {
        this.fat = fat;
    }

    public Integer getFatCal() {
        return this.fatCal;
    }

    public FoodNutritionalValue fatCal(Integer fatCal) {
        this.fatCal = fatCal;
        return this;
    }

    public void setFatCal(Integer fatCal) {
        this.fatCal = fatCal;
    }

    public Integer getCarbohydrate() {
        return this.carbohydrate;
    }

    public FoodNutritionalValue carbohydrate(Integer carbohydrate) {
        this.carbohydrate = carbohydrate;
        return this;
    }

    public void setCarbohydrate(Integer carbohydrate) {
        this.carbohydrate = carbohydrate;
    }

    public Integer getCarbohydrateCal() {
        return this.carbohydrateCal;
    }

    public FoodNutritionalValue carbohydrateCal(Integer carbohydrateCal) {
        this.carbohydrateCal = carbohydrateCal;
        return this;
    }

    public void setCarbohydrateCal(Integer carbohydrateCal) {
        this.carbohydrateCal = carbohydrateCal;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public FoodNutritionalValue quantity(Integer quantity) {
        this.quantity = quantity;
        return this;
    }

    public void setQuantity(Integer quantity) {
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
            ", barcode='" + getBarcode() + "'" +
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
