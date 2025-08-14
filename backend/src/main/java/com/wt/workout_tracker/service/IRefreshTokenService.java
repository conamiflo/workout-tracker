package com.wt.workout_tracker.service;

import com.wt.workout_tracker.model.RefreshToken;
import com.wt.workout_tracker.model.User;

import java.util.Optional;

public interface IRefreshTokenService {
    Optional<RefreshToken> findByToken(String token);
    RefreshToken createRefreshToken(String username);
    RefreshToken verifyExpiration(RefreshToken token);
    void deleteByUser(User user);
}