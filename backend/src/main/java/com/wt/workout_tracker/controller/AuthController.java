package com.wt.workout_tracker.controller;

import com.wt.workout_tracker.dto.*;
import com.wt.workout_tracker.exception.TokenRefreshException;
import com.wt.workout_tracker.exception.UserAlreadyExistsException;
import com.wt.workout_tracker.model.RefreshToken;
import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.security.JwtUtil;
import com.wt.workout_tracker.service.IRefreshTokenService;
import com.wt.workout_tracker.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Map;

@RequestMapping("/api/auth")
@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final IUserService userService;
    private final IRefreshTokenService refreshTokenService;

    @Autowired
    public AuthController(com.wt.workout_tracker.service.impl.UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil, com.wt.workout_tracker.service.impl.RefreshTokenService refreshTokenService){
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;

    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String accessToken = jwtUtil.generateToken(userDetails);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());

            return ResponseEntity.ok(new LoginResponseDTO(
                    accessToken,
                    refreshToken.getToken(),
                    userDetails.getUsername()
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequestDTO request) {
        String requestRefreshToken = request.getRefreshToken();
        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>()));
                    return ResponseEntity.ok(new TokenRefreshResponseDTO(token, requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Invalid refresh token"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO userRegistrationDTO) {
        try {
            User registeredUser = userService.registerUser(userRegistrationDTO);
            UserResponseDTO userResponseDTO = new UserResponseDTO(registeredUser);
            return new ResponseEntity<>(userResponseDTO, HttpStatus.CREATED);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Registration failed"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody TokenRefreshRequestDTO logOutRequest) {
        String refreshToken = logOutRequest.getRefreshToken();
        refreshTokenService.findByToken(refreshToken)
                .ifPresent(token -> refreshTokenService.deleteByUser(token.getUser()));

        return ResponseEntity.ok().build();
    }

}
