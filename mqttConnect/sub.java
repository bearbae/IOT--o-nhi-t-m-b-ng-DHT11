package com.example.demo.mqttConnect;

import com.example.demo.model.Sensor;
import com.example.demo.service.SensorService;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class sub {

    private final SensorService sensorService;

    @Autowired
    public sub(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    public void runSub(){
//        String brokerUrl = "tcp://localhost:1883";
//        String clientId = "MqttPublisher";
        String brokerUrl = "tcp://192.168.26.103:1883";
        String clientId = "MqttSubscriber";
        String topic = "sensor/data";

        try {
            MqttClient client = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);

            System.out.println("Connecting to broker: " + brokerUrl);
            client.connect(connOpts);
            System.out.println("Connected");

            client.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    System.out.println("Connection lost: " + cause.getMessage());
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {

                    // luu lai Sensor vua gui o day
                    // temperature: 80, humidity: 100, light: 1000
                    String data = new String(message.getPayload());
                    String[] d = data.split(",");
                    int temp = 0, hum = 0, light = 0;
                    String[] a = d[0].split(":");
                    temp = Integer.parseInt(a[1].trim());
                    a = d[1].split(":");
                    hum = Integer.parseInt(a[1].trim());
                    a = d[2].split(":");
                    light = Integer.parseInt(a[1].trim());


                    System.out.println("Message received on topic " + topic + ": " + new String(message.getPayload()));
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                }
            });

            client.subscribe(topic);
            System.out.println("Subscribed to topic: " + topic);


        } catch (MqttException e) {
            e.printStackTrace();
        }
    }
}
