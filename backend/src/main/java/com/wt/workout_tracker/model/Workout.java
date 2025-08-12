package com.wt.workout_tracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "workouts")
public class Workout {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseType exerciseType;

    @Column(nullable = false)
    private int durationMinutes;

    private int calories;

    @Column(nullable = false)
    private int intensity;

    @Column(nullable = false)
    private int fatigue;

    @Column(length = 2000)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime  performedAt;
}