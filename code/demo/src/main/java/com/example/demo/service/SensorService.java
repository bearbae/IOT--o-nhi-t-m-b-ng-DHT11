package com.example.demo.service;

import com.example.demo.model.Sensor;
import com.example.demo.repository.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SensorService {
    @Autowired
    SensorRepository sensorRepository;

    public List<Sensor> getAllSensors(){
        List<Sensor> list = sensorRepository.findAll();
        return list;
    }

    public void create (Sensor sensor){
        sensorRepository.save(sensor);
    }

    public List<Sensor> getSensorsForDashboard(){
        List<Sensor> list = sensorRepository.getSensorsForDashboard();
        return list;
    }

    public Sensor getNewSensor() {
        Sensor sensor = sensorRepository.getNewSensor();
        return sensor;
    }

    public List<Sensor> searchTemp(String temp){
        List<Sensor> list = sensorRepository.searchTemp(temp);
        return list;
    }

    public List<Sensor> searchHum(String hum){
        List<Sensor> list = sensorRepository.searchHum(hum);
        return list;
    }

    public List<Sensor> searchLight(String light){
        List<Sensor> list = sensorRepository.searchLight(light);
        return list;
    }

    public List<Sensor> findDataBetweenDates(String start, String end){
        List<Sensor> list = sensorRepository.findDataBetweenDates(start, end);
        return list;
    }





}
