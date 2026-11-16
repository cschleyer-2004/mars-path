package com.nasacyberchallengeapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class HomeController {
	@GetMapping("/")
	public String home(Model model){
        model.addAttribute("message", "Welcome to the Dynamic Home Page!");
    	return "index";
    }
}