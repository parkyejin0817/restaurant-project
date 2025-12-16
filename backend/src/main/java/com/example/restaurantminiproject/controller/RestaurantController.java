package com.example.restaurantminiproject.controller;

import com.example.restaurantminiproject.entity.Restaurant;
import com.example.restaurantminiproject.service.RestaurantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    //맛집 등록
    @PostMapping
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantService.save(restaurant);
    }

    //목록 조회
    @GetMapping
    public List<Restaurant> getRestaurants() {
        return restaurantService.findAll();
    }
}
