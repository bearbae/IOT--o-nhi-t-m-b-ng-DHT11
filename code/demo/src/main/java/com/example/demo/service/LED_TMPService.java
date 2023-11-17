package com.example.demo.service;

import com.example.demo.model.LED;
import com.example.demo.model.LED_TMP;
import com.example.demo.repository.LED_TMPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LED_TMPService {
    @Autowired
    LED_TMPRepository ledTmpRepository;

    public void create(LED_TMP ledTMP){
        ledTmpRepository.save(ledTMP);
    }

    public LED_TMP getNewLedTmp(){
        return ledTmpRepository.getNewLedTmp();
    }

}
