package com.wt.workout_tracker.controller;

import com.wt.workout_tracker.dto.UserResponseDTO;
import com.wt.workout_tracker.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(@PathVariable String username) {
        UserResponseDTO user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }
}
