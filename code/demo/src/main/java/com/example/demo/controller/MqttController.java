package com.example.demo.controller;

import com.example.demo.MqttBeans;
import com.example.demo.model.LED;
import com.example.demo.model.LED_TMP;
import com.example.demo.service.LEDService;
import com.example.demo.service.LED_TMPService;
import com.example.demo.service.SensorService;
import com.fasterxml.jackson.databind.JsonNode;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@CrossOrigin
@RestController
public class MqttController {


    @Autowired
    MqttBeans mqttBeans;

    @Autowired
    SensorService sensorService;


    @Autowired
    LEDService ledService;

    @Autowired
    LED_TMPService ledTmpService;

    // lấy dữ liệu cảm biến
    @GetMapping("/sensor/get-all")
    public ResponseEntity<?> getAll(){
        try {
            return ResponseEntity.ok(sensorService.getAllSensors());
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }

    @GetMapping("/sensor/get-top-1-sensor")
    public ResponseEntity<?> getNewSensor(){
        try {
            return ResponseEntity.ok(sensorService.getNewSensor());
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }
// lấy dữ liệu từ led
    @GetMapping("/led/get-all")
    public ResponseEntity<?> getAllLEDs(){
        try {
            return ResponseEntity.ok(ledService.getAllLEDs());
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }
// xử lí yêu cầu POST đến /led/pub và up thông tin lên mqtt broken
    @PostMapping("/led/pub")
    public ResponseEntity<?> postData(@RequestBody JsonNode message) {
        try {
            String l1 = message.get("l1").asText();
            String l2 = message.get("l2").asText();
            String l3 = message.get("l3").asText();
            String tmp = l1 + " " + l2 + " " + l3;
            System.out.println(tmp);

            LED_TMP ledTmp = new LED_TMP();
            ledTmp.setState(tmp);
            ledTmp.setOk(0);

            ledTmpService.create(ledTmp);


            MqttClient client =new MqttClient("tcp://172.20.10.4:1883","MqttPublisher",new MemoryPersistence());
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);
            client.connect(connOpts);
            MqttMessage mqttMessage=new MqttMessage(tmp.getBytes());
            client.publish("led",mqttMessage);



        } catch (Exception e) {
            e.printStackTrace();
        }
        return  new ResponseEntity<>(HttpStatus.OK);
    }
// kiểm tra trạng thái của led
    @GetMapping("/led/check")
    public ResponseEntity<?> check(){
        try {
            LED_TMP ledTmp = ledTmpService.getNewLedTmp();
            String mess = "";

            if(ledTmp.getOk() == 1){
                mess = "OK";
            }
            else{
                mess = "NOT OK";
            }

            System.out.println(mess);
            return ResponseEntity.ok(mess);
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }
// tìm kiếm dữ liệu theo cảm nhiệt độ
    @GetMapping("/sensor/temp/search")
    public ResponseEntity<?> searchTemp(@RequestParam("temp") String temp){

        try {
            return ResponseEntity.ok(sensorService.searchTemp(temp));
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }

    @GetMapping("/sensor/hum/search")
    public ResponseEntity<?> searchHum(@RequestParam("hum") String hum){

        try {
            return ResponseEntity.ok(sensorService.searchHum(hum));
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }

    @GetMapping("/sensor/light/search")
    public ResponseEntity<?> searchLight(@RequestParam("light") String light){

        try {
//            System.out.println(type + " " + light);
            return ResponseEntity.ok(sensorService.searchLight(light));
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }

// lọc dữ liệu cảm biến theo khoảng thời gian
    @GetMapping("/sensor/filter")
    public ResponseEntity<?> findDataBetweenDates(@RequestParam("start") String start, @RequestParam("end") String end){

        try {
//            System.out.println(type + " " + light);
            return ResponseEntity.ok(sensorService.findDataBetweenDates(start, end));
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }

    @GetMapping("/led/time/search")
    public ResponseEntity<?> searchTime(@RequestParam("time") String time){

        try {
            return ResponseEntity.ok(ledService.findByTime(time));
        } catch (Exception ex){
            ex.printStackTrace();
            return ResponseEntity.ok("fail");
        }
    }


    @GetMapping("/led/temp/pub")
    public ResponseEntity<?> tempToData() {
        try {

            String tmp = "1 2";
            MqttClient client =new MqttClient("tcp://172.20.10.4:1883","MqttPublisher",new MemoryPersistence());
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);
            client.connect(connOpts);
            MqttMessage mqttMessage=new MqttMessage(tmp.getBytes());
            client.publish("led-2s",mqttMessage);



        } catch (Exception e) {
            e.printStackTrace();
        }
        return  new ResponseEntity<>(HttpStatus.OK);
    }

}