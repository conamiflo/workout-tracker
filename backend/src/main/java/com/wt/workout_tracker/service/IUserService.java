package com.wt.workout_tracker.service;

import com.wt.workout_tracker.dto.UserRegistrationDTO;
import com.wt.workout_tracker.dto.UserResponseDTO;
import com.wt.workout_tracker.model.User;

public interface IUserService {

    User registerUser(UserRegistrationDTO userRegistrationDTO);
    UserResponseDTO getUserByUsername(String username);
}
