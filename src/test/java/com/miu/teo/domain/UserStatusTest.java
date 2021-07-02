package com.miu.teo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.miu.teo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserStatus.class);
        UserStatus userStatus1 = new UserStatus();
        userStatus1.setId(1L);
        UserStatus userStatus2 = new UserStatus();
        userStatus2.setId(userStatus1.getId());
        assertThat(userStatus1).isEqualTo(userStatus2);
        userStatus2.setId(2L);
        assertThat(userStatus1).isNotEqualTo(userStatus2);
        userStatus1.setId(null);
        assertThat(userStatus1).isNotEqualTo(userStatus2);
    }
}
