package com.example.restaurantminiproject.repository;

import com.example.restaurantminiproject.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
