package com.wt.workout_tracker.dto;

import com.wt.workout_tracker.model.ExerciseType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateWorkoutDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "Exercise type is required")
    private ExerciseType exerciseType;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    @Max(value = 600, message = "Duration cannot exceed 600 minutes")
    private int durationMinutes;

    @Min(value = 0, message = "Calories cannot be negative")
    @Max(value = 3000, message = "Calories cannot exceed 3000")
    private int calories;

    @NotNull(message = "Intensity is required")
    @Min(value = 1, message = "Intensity must be at least 1")
    @Max(value = 10, message = "Intensity cannot exceed 10")
    private int intensity;

    @NotNull(message = "Fatigue level is required")
    @Min(value = 1, message = "Fatigue level must be at least 1")
    @Max(value = 10, message = "Fatigue level cannot exceed 10")
    private int fatigue;

    @NotNull(message = "Workout date and time is required")
    private LocalDateTime performedAt;

    @Size(max = 2000, message = "Notes cannot exceed 2000 characters")
    private String notes;

}
