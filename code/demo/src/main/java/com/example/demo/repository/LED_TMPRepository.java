package com.example.demo.repository;

import com.example.demo.model.LED_TMP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LED_TMPRepository extends JpaRepository<LED_TMP, Integer> {

    @Query(value = "SELECT * FROM led_tmp ORDER BY id DESC LIMIT 1", nativeQuery = true)
    LED_TMP getNewLedTmp();
}
