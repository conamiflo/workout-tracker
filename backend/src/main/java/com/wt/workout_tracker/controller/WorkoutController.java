package com.wt.workout_tracker.controller;

import com.wt.workout_tracker.dto.CreateWorkoutDTO;
import com.wt.workout_tracker.dto.MonthlySummaryDTO;
import com.wt.workout_tracker.dto.WorkoutDTO;
import com.wt.workout_tracker.model.Workout;
import com.wt.workout_tracker.service.impl.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @GetMapping("/{username}")
    public ResponseEntity<Page<WorkoutDTO>> getUserWorkouts(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<WorkoutDTO> workouts = workoutService.getUserWorkouts(username, page, size);
        return ResponseEntity.ok(workouts);
    }

    @DeleteMapping("/{workoutId}/user/{username}")
    public ResponseEntity<Void> deleteWorkout(
            @PathVariable UUID workoutId,
            @PathVariable String username) {

        workoutService.deleteWorkout(username, workoutId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{username}/progress")
    public ResponseEntity<MonthlySummaryDTO> getMonthlyProgress(
            @PathVariable String username,
            @RequestParam int year,
            @RequestParam int month) {

        MonthlySummaryDTO summary = workoutService.getMonthlyProgress(username, year, month);
        return ResponseEntity.ok(summary);
    }
}
