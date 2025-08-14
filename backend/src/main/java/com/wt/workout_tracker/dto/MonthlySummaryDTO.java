package com.wt.workout_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySummaryDTO {
    private int year;
    private int month;
    private String monthName;
    private int totalDuration;
    private int totalWorkouts;
    private double avgIntensity;
    private double avgFatigue;
    private List<WeeklyProgressDTO> weeklyProgress;
}