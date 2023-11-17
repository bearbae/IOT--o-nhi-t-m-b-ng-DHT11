package com.example.demo.service;

import com.example.demo.model.LED;
import com.example.demo.model.Sensor;
import com.example.demo.repository.LEDRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LEDService {
    @Autowired
    LEDRepository ledRepository;

    public List<LED> getAllLEDs(){
        List<LED> list = ledRepository.findAll();
        return list;
    }

    public void create(LED led){
        ledRepository.save(led);
    }

    public List<LED> findByTime(String time){
        List<LED> list = ledRepository.findByTime(time);
        return list;
    }
}
