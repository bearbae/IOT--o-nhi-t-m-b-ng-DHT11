package com.example.demo.repository;

import com.example.demo.model.LED;
import com.example.demo.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LEDRepository extends JpaRepository<LED, Integer> {

    @Query(value = "SELECT * FROM led WHERE " +
            "STR_TO_DATE(time, '%d/%m/%Y %H:%i:%s') = ?1 ", nativeQuery = true)
    List<LED> findByTime(String time);
}
