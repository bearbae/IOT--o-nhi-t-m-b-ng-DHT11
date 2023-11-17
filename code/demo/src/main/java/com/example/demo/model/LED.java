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
@Table(name = "led")
public class LED {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "ledID")
    private int ledID;

    @Column(name = "action")
    private String action;

    @JsonFormat(pattern = "MM/dd/yyyy HH:mm:ss")
    @Column(name = "time")
    private String time;
}

