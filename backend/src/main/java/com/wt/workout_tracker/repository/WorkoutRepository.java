package com.wt.workout_tracker.repository;

import com.wt.workout_tracker.model.User;
import com.wt.workout_tracker.model.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, UUID> {
    Page<Workout> findByUserOrderByPerformedAtDesc(User user, Pageable pageable);

    @Query("SELECT w FROM Workout w WHERE w.user = :user " +
            "AND w.performedAt >= :startDate AND w.performedAt <= :endDate " +
            "ORDER BY w.performedAt ASC")
    List<Workout> findByUserAndPerformedAtBetween(
            @Param("user") User user,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}