package com.wt.workout_tracker.dto;

import com.wt.workout_tracker.model.ExerciseType;
import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.model.Workout;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
public class WorkoutDTO {

    private UUID id;
    private ExerciseType exerciseType;
    private int durationMinutes;
    private int calories;
    private int intensity;
    private int fatigue;
    private String notes;
    private LocalDateTime performedAt;

    public WorkoutDTO(Workout workout) {
        this.id = workout.getId();
        this.exerciseType = workout.getExerciseType();
        this.durationMinutes = workout.getDurationMinutes();
        this.calories = workout.getCalories();
        this.intensity = workout.getIntensity();
        this.fatigue = workout.getFatigue();
        this.notes = workout.getNotes();
        this.performedAt = workout.getPerformedAt();
    }

}
