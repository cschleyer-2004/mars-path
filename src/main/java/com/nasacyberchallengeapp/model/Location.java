package com.nasacyberchallengeapp.model;

public record Location(
        Long id,
        String slug,
        String name,
        String mapFile,

        Double latitude,
        Double longitude,

        String region,
        String status,
        String description,
        String interest,

        String terrainType,
        String scienceValue,
        String radiationRisk,
        String recommendedTransport,

        String dataSource,
        String sourceUrl,
        String sourceResolution,

        Bounds bounds
) {
}