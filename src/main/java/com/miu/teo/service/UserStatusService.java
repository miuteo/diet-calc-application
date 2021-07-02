package com.miu.teo.service;

import com.miu.teo.domain.User;
import com.miu.teo.domain.UserStatus;
import com.miu.teo.repository.UserRepository;
import com.miu.teo.repository.UserStatusRepository;
import javax.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserStatusService {

    private final UserStatusRepository userStatusRepository;
    private final UserRepository userRepository;

    public UserStatusService(UserStatusRepository userStatusRepository, UserRepository userRepository) {
        this.userStatusRepository = userStatusRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public UserStatus createUserStatus(UserStatus userStatus, String login) {
        User user = userRepository.findOneByLogin(login).orElseThrow(UserNotFounException::new);

        userStatus.setUser(user);

        double weight = userStatus.getWeight();
        int cal = (int) Math.round(21 * weight);
        userStatus.setProteinNeed((int) Math.round(2 * weight));
        userStatus.setCalProteinNeed(4 * userStatus.getProteinNeed());

        userStatus.setCalFatNeed((int) Math.round(cal * 0.25));
        userStatus.setFatNeed(userStatus.getCalFatNeed() / 9);

        userStatus.setCalCarbohydrateNeed(cal - userStatus.getCalProteinNeed() - userStatus.getCalFatNeed());
        userStatus.setCarbohydrateNeed(userStatus.getCalCarbohydrateNeed() / 4);

        userStatusRepository.findByUserIsCurrentUser().forEach(userStatusRepository::delete);
        return userStatusRepository.save(userStatus);
    }
}
