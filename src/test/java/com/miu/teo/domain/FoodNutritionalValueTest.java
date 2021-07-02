package com.miu.teo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.miu.teo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FoodNutritionalValueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FoodNutritionalValue.class);
        FoodNutritionalValue foodNutritionalValue1 = new FoodNutritionalValue();
        foodNutritionalValue1.setId(1L);
        FoodNutritionalValue foodNutritionalValue2 = new FoodNutritionalValue();
        foodNutritionalValue2.setId(foodNutritionalValue1.getId());
        assertThat(foodNutritionalValue1).isEqualTo(foodNutritionalValue2);
        foodNutritionalValue2.setId(2L);
        assertThat(foodNutritionalValue1).isNotEqualTo(foodNutritionalValue2);
        foodNutritionalValue1.setId(null);
        assertThat(foodNutritionalValue1).isNotEqualTo(foodNutritionalValue2);
    }
}
