package com.example.demo.mqttConnect;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

public class pub {
    public static void main(String[] args) {
        String brokerUrl = "tcp://localhost:1883";
        String clientId = "MqttPublisher";
        String topic = "test";

        try {
            MqttClient client = new MqttClient(brokerUrl, clientId, new MemoryPersistence());
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);

            System.out.println("Connecting to broker: " + brokerUrl);
            client.connect(connOpts);
            System.out.println("Connected");

            String message = "HELOOOOOOOOOOO";

            for (int i = 0; i < 10000; i++) {
                String msg = message + i;
                MqttMessage mqttMessage = new MqttMessage(msg.getBytes());
                client.publish(topic, mqttMessage);
                System.out.println("Published message: " + msg);
                Thread.sleep(2000);
            }

            client.disconnect();
            System.out.println("Disconnected");

        } catch (MqttException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}

