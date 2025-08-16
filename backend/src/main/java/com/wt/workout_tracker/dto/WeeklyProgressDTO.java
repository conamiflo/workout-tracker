package com.wt.workout_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyProgressDTO {
    private int weekNumber;
    private String dateRange;
    private int totalDuration;
    private int workoutCount;
    private double avgIntensity;
    private double avgFatigue;
}