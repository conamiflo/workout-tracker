package com.wt.workout_tracker.service.impl;

import com.wt.workout_tracker.dto.CreateWorkoutDTO;
import com.wt.workout_tracker.dto.MonthlySummaryDTO;
import com.wt.workout_tracker.dto.WeeklyProgressDTO;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

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

    @Override
    public MonthlySummaryDTO getMonthlyProgress(String username, int year, int month) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<WeeklyProgressDTO> weeklyProgress = getWeeklyProgress(user, year, month);

        if (weeklyProgress.stream().allMatch(w -> w.getWorkoutCount() == 0)) {
            return new MonthlySummaryDTO(year, month, Month.of(month).name(), 0, 0, 0.0, 0.0, weeklyProgress);
        }

        int totalDuration = weeklyProgress.stream().mapToInt(WeeklyProgressDTO::getTotalDuration).sum();
        int totalWorkouts = weeklyProgress.stream().mapToInt(WeeklyProgressDTO::getWorkoutCount).sum();

        double avgIntensity = weeklyProgress.stream()
                .filter(w -> w.getWorkoutCount() > 0)
                .mapToDouble(WeeklyProgressDTO::getAvgIntensity)
                .average()
                .orElse(0.0);
        double avgFatigue = weeklyProgress.stream()
                .filter(w -> w.getWorkoutCount() > 0)
                .mapToDouble(WeeklyProgressDTO::getAvgFatigue)
                .average()
                .orElse(0.0);

        return new MonthlySummaryDTO(
                year,
                month,
                Month.of(month).name(),
                totalDuration,
                totalWorkouts,
                Math.round(avgIntensity * 10.0) / 10.0,
                Math.round(avgFatigue * 10.0) / 10.0,
                weeklyProgress
        );
    }

    public List<WeeklyProgressDTO> getWeeklyProgress(User user, int year, int month) {

        LocalDateTime startOfMonth = LocalDate.of(year, month, 1).atStartOfDay();
        LocalDateTime endOfMonth = LocalDate.of(year, month, LocalDate.of(year, month, 1).lengthOfMonth())
                .atTime(23, 59, 59);

        List<Workout> workouts = workoutRepository.findByUserAndPerformedAtBetween(user, startOfMonth, endOfMonth);

        Map<Integer, List<Workout>> groupedByWeek = workouts.stream()
                .collect(Collectors.groupingBy(w -> (w.getPerformedAt().getDayOfMonth() - 1) / 7 + 1));

        int daysInMonth = startOfMonth.toLocalDate().lengthOfMonth();
        int totalWeeks = (int) Math.ceil(daysInMonth / 7.0);

        List<WeeklyProgressDTO> result = new ArrayList<>();

        for (int week = 1; week <= totalWeeks; week++) {
            List<Workout> weekWorkouts = groupedByWeek.getOrDefault(week, Collections.emptyList());
            int totalDuration = weekWorkouts.stream().mapToInt(Workout::getDurationMinutes).sum();
            int workoutCount = weekWorkouts.size();
            double avgIntensity = weekWorkouts.stream().mapToInt(Workout::getIntensity).average().orElse(0);
            double avgFatigue = weekWorkouts.stream().mapToInt(Workout::getFatigue).average().orElse(0);

            int startDay = (week - 1) * 7 + 1;
            int endDay = Math.min(week * 7, daysInMonth);

            String dateRange = formatDateRange(LocalDate.of(year, month, startDay), LocalDate.of(year, month, endDay));
            result.add(new WeeklyProgressDTO(week, dateRange, totalDuration, workoutCount, avgIntensity, avgFatigue));
        }
        return result;
    }

    private String formatDateRange(LocalDate start, LocalDate end) {
        String monthAbbr = start.format(DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH));
        return start.getMonth() == end.getMonth()
                ? monthAbbr + " " + start.getDayOfMonth() + "-" + end.getDayOfMonth()
                : start.format(DateTimeFormatter.ofPattern("MMM d", Locale.ENGLISH)) + " - " +
                end.format(DateTimeFormatter.ofPattern("MMM d", Locale.ENGLISH));
    }
}
