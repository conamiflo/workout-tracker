package com.wt.workout_tracker.service;

import com.wt.workout_tracker.dto.CreateWorkoutDTO;
import com.wt.workout_tracker.model.Workout;

public interface IWorkoutService {

    Workout createWorkout(CreateWorkoutDTO createWorkoutDTO);
}
