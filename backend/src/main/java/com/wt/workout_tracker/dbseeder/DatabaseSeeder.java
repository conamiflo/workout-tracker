package com.wt.workout_tracker.config;

import com.github.javafaker.Faker;
import com.wt.workout_tracker.model.ExerciseType;
import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.model.Workout;
import com.wt.workout_tracker.repository.UserRepository;
import com.wt.workout_tracker.repository.WorkoutRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);
    private final UserRepository userRepository;
    private final WorkoutRepository workoutRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker();

    @Value("${app.seed}")
    private boolean seedOnStartup;

    @Value("${app.seed.users}")
    private int usersCount;

    @Value("${app.seed.workouts}")
    private int workoutsCount;

    @Autowired
    public DatabaseSeeder(UserRepository userRepository,
                          WorkoutRepository workoutRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.workoutRepository = workoutRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (seedOnStartup && userRepository.count() == 0) {
            logger.info("Starting database seeding...");
            seedUsers();
            seedWorkouts();
            logger.info("Database seeding finished - {} users, {} workouts created",
                    userRepository.count(), workoutRepository.count());
        } else {
            logger.info("Seeding disabled, skipping");
        }
    }

    private void seedUsers() {
        logger.info("Seeding {} users...", usersCount);
        List<User> users = new ArrayList<>();

        for (int i = 0; i < usersCount - 1; i++) {
            User user = new User();
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();

            user.setUsername(generateUsername(firstName, lastName, i));
            user.setPassword(passwordEncoder.encode("password"));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setPhoneNumber(generatePhoneNumber());
            users.add(user);
        }

        userRepository.saveAll(users);
        logger.info("Users seeded successfully");
    }

    private void seedWorkouts() {
        logger.info("Seeding {} workouts...", workoutsCount);
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            logger.warn("No users found, skipping workout seeding");
            return;
        }

        List<Workout> workouts = new ArrayList<>();
        ExerciseType[] exerciseTypes = ExerciseType.values();

        for (int i = 0; i < workoutsCount; i++) {
            Workout workout = new Workout();
            ExerciseType type = exerciseTypes[faker.number().numberBetween(0, exerciseTypes.length)];
            workout.setUser(users.get(faker.number().numberBetween(0, users.size())));
            workout.setExerciseType(type);
            workout.setDurationMinutes(getDurationForType(type));
            workout.setCalories(getCaloriesForType(type, workout.getDurationMinutes()));
            workout.setIntensity(faker.number().numberBetween(1, 10));
            workout.setFatigue(faker.number().numberBetween(1, 10));
            workout.setNotes(getWorkoutNotes());
            workout.setPerformedAt(generateWorkoutTime());

            workouts.add(workout);
        }

        workoutRepository.saveAll(workouts);
        logger.info("Workouts seeded successfully");
    }

    private String generateUsername(String firstName, String lastName, int index) {
        String baseUsername = (firstName.toLowerCase() + "." + lastName.toLowerCase())
                .replaceAll("[^a-zA-Z0-9.]", "");
        return index > 0 ? baseUsername + (index + 1) : baseUsername;
    }

    private String generatePhoneNumber() {
        return faker.phoneNumber().phoneNumber();
    }

    private int getDurationForType(ExerciseType type) {
        return switch (type) {
            case STRENGTH -> faker.number().numberBetween(45, 90);
            case CARDIO -> faker.number().numberBetween(20, 75);
            case FLEXIBILITY -> faker.number().numberBetween(15, 60);
            case SPORTS -> faker.number().numberBetween(60, 120);
            case OTHER -> faker.number().numberBetween(30, 90);
        };
    }

    private int getCaloriesForType(ExerciseType type, int duration) {
        int caloriesPerMinute = switch (type) {
            case STRENGTH -> faker.number().numberBetween(3, 6);
            case CARDIO -> faker.number().numberBetween(7, 12);
            case FLEXIBILITY -> faker.number().numberBetween(1, 3);
            case SPORTS -> faker.number().numberBetween(5, 9);
            case OTHER -> faker.number().numberBetween(3, 7);
        };
        return duration * caloriesPerMinute + faker.number().numberBetween(-50, 50);
    }

    private String getWorkoutNotes() {
        String[] allNotes = {
                "Great workout session today! Feeling stronger and more energized.",
                "Pushed my limits but maintained good form throughout the exercise.",
                "Perfect weather for training. Really enjoyed this workout.",
                "Challenging session but very rewarding. Made good progress today.",
                "Felt amazing during the workout. Energy levels were through the roof!",
                "Solid training session. Focused on technique and consistency.",
                "Excellent workout! Beat my personal record and feeling accomplished."
        };

        return allNotes[faker.number().numberBetween(0, allNotes.length)] + " " +
                faker.lorem().sentence(faker.number().numberBetween(2, 5));
    }

    private LocalDateTime generateWorkoutTime() {
        LocalDateTime now = LocalDateTime.now();
        long randomDays = faker.number().numberBetween(0, 120);
        int hour = faker.number().numberBetween(6, 22);
        int minute = faker.options().option(0, 15, 30, 45);

        return now.minusDays(randomDays)
                .withHour(hour)
                .withMinute(minute)
                .withSecond(0)
                .withNano(0);
    }
}