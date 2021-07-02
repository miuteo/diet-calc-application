package com.miu.teo.repository;

import com.miu.teo.domain.UserDetails;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UserDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
    @Query("select userDetails from UserDetails userDetails where userDetails.user.login = ?#{principal.username}")
    List<UserDetails> findByUserIsCurrentUser();
}
