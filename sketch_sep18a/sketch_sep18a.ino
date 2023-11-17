#include <DHT.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>


const char* ssid = "qqtien";
const char* password = "123456789";
const char* mqtt_server = "172.20.10.4";

const int DHTPIN = 2;
const int DHTTYPE = DHT11;
const int LDR_PIN = A0;

const int led1 = 5;
const int led2 = 13;
const int led3 = 15;
//d8 - 15
// d7 - 13


DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected, IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, unsigned char* payload, unsigned int length) {
  unsigned long previousMillis = 0;  // Biến lưu trữ thời gian millis() của lần trước
  const long interval = 2000;
  if (strcmp(topic, "led") == 0) {
    Serial.print(payload[0]);
    Serial.println(payload[2]);
    // 0 0 0
    if (payload[0] == 48) digitalWrite(led1, LOW);
    if (payload[0] == 4/9) digitalWrite(led1, HIGH);

    if (payload[2] == 48) digitalWrite(led2, LOW);
    if (payload[2] == 49) digitalWrite(led2, HIGH);

    if (payload[4] == 48) digitalWrite(led3, LOW);
    if (payload[4] == 49) digitalWrite(led3, HIGH);

// tao chuoi tu payload va gui den mess
    String mess = "";
    for (int i = 0; i <= 4; i++) {
      mess += (char)payload[i];
    }
    Serial.println(mess);
    client.publish("mess", mess.c_str());
  }
  else{ 
    Serial.println(payload[0]);
    unsigned long currentMillis = millis(); 
    if (currentMillis - previousMillis >= interval) {
      Serial.println("123");
      previousMillis = currentMillis; 
       Serial.println(currentMillis);
      digitalWrite(led1, !digitalRead(led1));
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266Client")) {
      Serial.println("connected");
      client.subscribe("led");
      client.subscribe("led-2s");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {

  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);


  Serial.begin(9600);
  dht.begin();
  setup_wifi();

  client.setServer(mqtt_server, 1883);

  client.subscribe("led");
  client.subscribe("led-2s");

  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // tao random
  int g = random(0, 100);
  // Serial.println(g);

  int t, h;
  int l;

  h = dht.readHumidity();
  t = dht.readTemperature();
  l = analogRead(LDR_PIN);

  delay(2000);

  String data = "temperature:" + String(t) + ",humidity:" + String(h) + ",light:" + String(l) + ",gas:" + String(g);
  client.publish("sensor", data.c_str());
}