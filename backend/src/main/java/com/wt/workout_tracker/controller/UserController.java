package com.wt.workout_tracker.controller;

import com.wt.workout_tracker.dto.MonthlySummaryDTO;
import com.wt.workout_tracker.dto.UserRegistrationDTO;
import com.wt.workout_tracker.dto.UserResponseDTO;
import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/users")
@RestController
public class UserController {

    private final IUserService userService;

    @Autowired
    public UserController(IUserService userService){
        this.userService = userService;
    }

    @GetMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@Valid @RequestBody UserRegistrationDTO userRegistrationDTO) {
        User registeredUser = userService.registerUser(userRegistrationDTO);
        UserResponseDTO userResponseDTO = new UserResponseDTO(registeredUser);
        return new ResponseEntity<>(userResponseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        try {
            UserResponseDTO user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

}
