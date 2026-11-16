package com.nasacyberchallengeapp.controller;

import com.nasacyberchallengeapp.model.Location;
import com.nasacyberchallengeapp.service.LocationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/mars")
public class LocationController {
	
	private final LocationService locationService;
	
	public LocationController(LocationService locationService) {
		this.locationService = locationService;
	}
	
	@GetMapping("/locations/{slug}")
	public Location getLocation(
			@PathVariable String slug) {
		return locationService.findBySlug(slug);
	}
	
	@GetMapping("/locations")
	public List<Location> getAllLocations(){
		return locationService.findAll();
	}
}