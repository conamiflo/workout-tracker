package com.wt.workout_tracker.controller;

import com.wt.workout_tracker.dto.UserRegistrationDTO;
import com.wt.workout_tracker.dto.UserResponseDTO;
import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/users")
@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegistrationDTO userRegistrationDTO) {
        User registeredUser = userService.registerUser(userRegistrationDTO);
        UserResponseDTO userResponseDTO = new UserResponseDTO(registeredUser);
        return new ResponseEntity<>(userResponseDTO, HttpStatus.CREATED);
    }



}
