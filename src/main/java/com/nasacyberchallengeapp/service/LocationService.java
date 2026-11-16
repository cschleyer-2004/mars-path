package com.nasacyberchallengeapp.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service; 
import com.nasacyberchallengeapp.model.Location;
import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class LocationService {
	private final ObjectMapper objectMapper;
	private List<Location> locations;
	
	public LocationService(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}
	
	@PostConstruct
	public void init() throws IOException {
		ClassPathResource resource = new ClassPathResource("data/locations.json");
		try (InputStream inputStream = resource.getInputStream()){
			this.locations = objectMapper.readValue(inputStream, new TypeReference<List<Location>>() {});
		}
	}
	
	public Location findBySlug(String slug) {
		return locations.stream()
				.filter(location -> location.slug().equals(slug))
						.findFirst()
						.orElseThrow(() ->
						new RuntimeException("Exception not found: " + slug));
	}
	
	public List<Location> findAll(){
		return locations;
	}
}