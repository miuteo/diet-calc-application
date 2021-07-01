package com.miu.teo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.miu.teo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MealTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Meal.class);
        Meal meal1 = new Meal();
        meal1.setId(1L);
        Meal meal2 = new Meal();
        meal2.setId(meal1.getId());
        assertThat(meal1).isEqualTo(meal2);
        meal2.setId(2L);
        assertThat(meal1).isNotEqualTo(meal2);
        meal1.setId(null);
        assertThat(meal1).isNotEqualTo(meal2);
    }
}
