package com.example.restaurantminiproject.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;        //가게 이름
    private String category;    //음식 종류
    private String location;    //가게 주소
    private Integer rating;     //별점
    private String review;      //한줄평


    public Restaurant() {
    }
}
