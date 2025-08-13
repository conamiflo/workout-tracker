package com.wt.workout_tracker.service;

import com.wt.workout_tracker.dto.UserRegistrationDTO;
import com.wt.workout_tracker.model.User;

public interface IUserService {

    User registerUser(UserRegistrationDTO userRegistrationDTO);
    User getUserByUsername(String username);
}
