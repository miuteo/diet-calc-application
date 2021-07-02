package com.miu.teo.repository;

import com.miu.teo.domain.UserStatus;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserStatusRepository extends JpaRepository<UserStatus, Long> {
    @Query("select userStatus from UserStatus userStatus where userStatus.user.login = ?#{principal.username}")
    List<UserStatus> findByUserIsCurrentUser();
}
