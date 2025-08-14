package com.wt.workout_tracker.service;

import com.wt.workout_tracker.dto.CreateWorkoutDTO;
import com.wt.workout_tracker.dto.MonthlySummaryDTO;
import com.wt.workout_tracker.dto.WorkoutDTO;
import com.wt.workout_tracker.model.Workout;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface IWorkoutService {

    Workout createWorkout(CreateWorkoutDTO createWorkoutDTO);
    Page<WorkoutDTO> getUserWorkouts(String username, int page, int size);
    void deleteWorkout(String username, UUID workoutId);
    public MonthlySummaryDTO getMonthlyProgress(String username, int year, int month);
}
