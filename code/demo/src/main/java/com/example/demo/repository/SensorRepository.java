package com.example.demo.repository;

import com.example.demo.model.Sensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SensorRepository extends JpaRepository<Sensor, Integer> {
    @Query(value = "SELECT * FROM iot.sensor ORDER BY id DESC LIMIT 10", nativeQuery = true)
    List<Sensor> getSensorsForDashboard();

    @Query(value = "SELECT * FROM iot.sensor ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Sensor getNewSensor();

    @Query(value = "SELECT * FROM iot.sensor WHERE " +
            "temp = ?1", nativeQuery = true)
    List<Sensor> searchTemp(String temp);

    @Query(value = "SELECT * FROM iot.sensor WHERE " +
            "hum = ?1", nativeQuery = true)
    List<Sensor> searchHum(String hum);

    @Query(value = "SELECT * FROM iot.sensor WHERE " +
            "light = ?1", nativeQuery = true)
    List<Sensor> searchLight(String light);

    @Query(value = "SELECT * FROM iot.sensor WHERE " +
            "STR_TO_DATE(time, '%d/%m/%Y %H:%i:%s') >= ?1 " +
            "AND " +
            "STR_TO_DATE(time, '%d/%m/%Y %H:%i:%s') <= ?2 ", nativeQuery = true)
    List<Sensor> findDataBetweenDates(String start, String end);



}
