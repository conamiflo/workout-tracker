package com.wt.workout_tracker.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private String username;

    public LoginResponseDTO(String accessToken, String refreshToken, String username) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
    }
}