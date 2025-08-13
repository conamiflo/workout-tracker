package com.wt.workout_tracker.controller;

import com.wt.workout_tracker.dto.CreateWorkoutDTO;
import com.wt.workout_tracker.model.Workout;
import com.wt.workout_tracker.service.impl.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/workouts")
@RestController
public class WorkoutController {
    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping
    public ResponseEntity<Workout> createWorkout(@RequestBody CreateWorkoutDTO request) {
        Workout workout = workoutService.createWorkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(workout);
    }
}
