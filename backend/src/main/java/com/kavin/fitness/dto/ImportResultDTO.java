package com.kavin.fitness.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class ImportResultDTO {
    private int weightImported;
    private int weightSkipped;
    private int workoutsImported;
    private int workoutsSkipped;
}
