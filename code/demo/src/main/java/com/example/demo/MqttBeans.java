package com.example.demo;




import com.example.demo.model.LED;
import com.example.demo.model.LED_TMP;
import com.example.demo.model.Sensor;
import com.example.demo.service.LEDService;
import com.example.demo.service.LED_TMPService;
import com.example.demo.service.SensorService;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.messaging.MessagingException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Configuration
public class MqttBeans {

    @Autowired
    LED_TMPService ledTmpService;

    @Autowired
    LEDService ledService;

    @Autowired
    SensorService sensorService;


    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory(); // tao ket noi mqtt
        MqttConnectOptions options = new MqttConnectOptions();

        // cauh dia chi
        options.setServerURIs(new String[] { "tcp://172.20.10.4:1883" });

        options.setCleanSession(true);

        factory.setConnectionOptions(options);

        return factory;
    }


    @Bean
    // nhan du lieu
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    @Bean
    // lang nghe du lieu tu topic va gui den
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter("serverIn",
                mqttClientFactory(), "sensor");

        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(2); // dat muc do giao tiep giua apdata va broken là 2
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    @Bean
    // lang nghe topic mess
    public MessageProducer messageInbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter(
                "serverInMessage", mqttClientFactory(), "mess");
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(2);
        adapter.setOutputChannel(mqttInputChannel()); // Sử dụng kênh đã được định nghĩa để xử lý dữ liệu.
        return adapter;
    }


    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler handler() {
        return new MessageHandler() {

            @Override
            public void handleMessage(Message<?> message) throws MessagingException {
                String topic = message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC).toString();



                if(topic.equals("mess")){
                // lay du lieu dieu khien led
                    LED_TMP ledTmp = ledTmpService.getNewLedTmp();

                    String state = message.getPayload().toString();

                    String[] a = state.split(" ");


                    if(state.equals(ledTmp.getState())){
                        ledTmp.setOk(1);
                        ledTmpService.create(ledTmp); // luu vao csdl

                        // tao 2 doi tuong LED 1 va 2 , 3 luu vao db

                        LED led1 = new LED();
                        led1.setLedID(1);
                        String action = "";
                        if(a[0].equals("0")){
                            action = "OFF";
                        }
                        else {
                            action = "ON";
                        }
                        led1.setAction(action);

                        LocalDateTime realTime = LocalDateTime.now();

                        // Định dạng thời gian thành string
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
                        String formattedTime = realTime.format(formatter);
                        led1.setTime(formattedTime);

                        // save thong tin led 2

                        LED led2 = new LED();
                        led2.setLedID(2);
                        if(a[1].equals("0")){
                            action = "OFF";
                        }
                        else {
                            action = "ON";
                        }
                        led2.setAction(action);

                        led2.setTime(formattedTime);


                        LED led3 = new LED();
                        led3.setLedID(3);
                        if(a[2].equals("0")){
                            action = "OFF";
                        }
                        else {
                            action = "ON";
                        }
                        led3.setAction(action);

                        led3.setTime(formattedTime);

                        ledService.create(led1);
                        ledService.create(led2);
                        ledService.create(led3);
                    }


                }
                else{
                    String data = message.getPayload().toString();

                    // Phân tích dữ liệu dựa trên dấu phẩy
                    String[] d = data.split(",");
                    int temp = 0, hum = 0, light = 0;


                    int gas = 0;

                    for (String item : d) {
                        String[] a = item.split(":");
                        String key = a[0].trim();
                        String value = a[1].trim();

                        if (key.equals("temperature")) {
                            temp = Integer.parseInt(value);
                        } else if (key.equals("humidity")) {
                            hum = Integer.parseInt(value);
                        } else if (key.equals("light")) {
                            light = Integer.parseInt(value);
                        }

                        else if (key.equals("gas")) {
                            gas = Integer.parseInt(value);
                        }
                    }

                    Sensor sensor = new Sensor();
                    sensor.setTemp(temp);
                    sensor.setHum(hum);
                    sensor.setLight(light);

                    LocalDateTime realTime = LocalDateTime.now();

                    // Định dạng thời gian thành string
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
                    String formattedTime = realTime.format(formatter);
                    sensor.setTime(formattedTime);


                    sensor.setGas(gas);

//                     bo save
                    sensorService.create(sensor);
                }

            }

        };
    }


}

