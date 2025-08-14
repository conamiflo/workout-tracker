package com.wt.workout_tracker.service.impl;

import com.wt.workout_tracker.dto.UserRegistrationDTO;
import com.wt.workout_tracker.dto.UserResponseDTO;
import com.wt.workout_tracker.exception.ResourceNotFoundException;
import com.wt.workout_tracker.exception.UserAlreadyExistsException;
import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.repository.UserRepository;
import com.wt.workout_tracker.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(UserRegistrationDTO userRegistrationDTO) {

        userRepository.findByUsername(userRegistrationDTO.getUsername())
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException("Username " + user.getUsername() + " is already taken.");
                });

        User newUser = new User();
        newUser.setUsername(userRegistrationDTO.getUsername());
        newUser.setFirstName(userRegistrationDTO.getFirstName());
        newUser.setLastName(userRegistrationDTO.getLastName());
        newUser.setPhoneNumber(userRegistrationDTO.getPhoneNumber());
        newUser.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));

        return userRepository.save(newUser);
    }

    @Override
    public UserResponseDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new ResourceNotFoundException("User witn username: " + username + " not found"));
        return new UserResponseDTO(user);
    }
}
