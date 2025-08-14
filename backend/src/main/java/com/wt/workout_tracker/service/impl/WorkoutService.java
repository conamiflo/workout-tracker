package com.wt.workout_tracker.service.impl;

import com.wt.workout_tracker.dto.CreateWorkoutDTO;
import com.wt.workout_tracker.dto.WorkoutDTO;
import com.wt.workout_tracker.exception.ResourceNotFoundException;
import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.model.Workout;
import com.wt.workout_tracker.repository.UserRepository;
import com.wt.workout_tracker.repository.WorkoutRepository;
import com.wt.workout_tracker.service.IWorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WorkoutService implements IWorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    @Autowired
    public WorkoutService(WorkoutRepository workoutRepository, UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
    }




    @Override
    public Workout createWorkout(CreateWorkoutDTO createWorkoutDTO) {
        User user = userRepository.findByUsername(createWorkoutDTO.getUsername()).get();

        Workout workout = new Workout();
        workout.setUser(user);
        workout.setExerciseType(createWorkoutDTO.getExerciseType());
        workout.setDurationMinutes(createWorkoutDTO.getDurationMinutes());
        workout.setCalories(createWorkoutDTO.getCalories());
        workout.setIntensity(createWorkoutDTO.getIntensity());
        workout.setFatigue(createWorkoutDTO.getFatigue());
        workout.setPerformedAt(createWorkoutDTO.getPerformedAt());
        workout.setNotes(createWorkoutDTO.getNotes());

        return workoutRepository.save(workout);
    }

    @Override
    public Page<WorkoutDTO> getUserWorkouts(String username, int page, int size) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<Workout> workoutPage = workoutRepository.findByUserOrderByPerformedAtDesc(user, PageRequest.of(page, size));
        return workoutPage.map(WorkoutDTO::new);

    }

    @Override
    public void deleteWorkout(String username, UUID workoutId) {

        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));
        if (!workout.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        workoutRepository.delete(workout);
    }


}
