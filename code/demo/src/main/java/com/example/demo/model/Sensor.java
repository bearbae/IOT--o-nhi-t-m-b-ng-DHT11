package com.example.demo.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "sensor")
public class Sensor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "temp")
    private int temp;

    @Column(name = "hum")
    private int hum;

    @Column(name = "light")
    private int light;

    @Column(name = "gas")
    private int gas;

    @JsonFormat(pattern = "MM/dd/yyyy HH:mm:ss")
    @Column(name = "time")
    private String time;


}
