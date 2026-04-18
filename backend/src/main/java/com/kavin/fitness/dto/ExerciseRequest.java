package com.kavin.fitness.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor
public class ExerciseRequest {

    @NotBlank
    private String exerciseName;

    /** "lifting" (default) or "cardio" */
    private String exerciseType = "lifting";

    /** Required for lifting exercises. */
    @Valid
    private List<SetRequest> sets;

    /** Required for cardio exercises — total duration in seconds. */
    private Integer durationSeconds;

    @Getter @Setter @NoArgsConstructor
    public static class SetRequest {
        @NotNull @Min(1)
        private Integer setNumber;

        @NotNull @Min(0)
        private Integer reps;

        @NotNull @DecimalMin("0.0")
        private BigDecimal weightLbs;
    }
}
