package com.wt.workout_tracker.dto;

import lombok.Data;

@Data
public class TokenRefreshRequestDTO {
    private String refreshToken;
}