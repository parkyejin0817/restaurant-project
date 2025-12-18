package com.example.restaurantminiproject.service;

import com.example.restaurantminiproject.entity.Restaurant;
import com.example.restaurantminiproject.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    //맛집 등록
    public Restaurant save(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    //목록 조회
    public List<Restaurant> findAll() {
        return restaurantRepository.findAll();
    }

}
