#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>

#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
String receiveSerialData = "";
String WIFI_SSID = "ko";            // 你的wifi ssid 账户
String WIFI_PASSWORD = "999888777"; // 你的wifi password 密码
String WS_IP = '192.168.1.101';     // 你要连接的websocket服务器ip
int WS_PORT = 3999;                 // 你要连接的websocket服务器端口

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{

  switch (type)
  {
  case WStype_DISCONNECTED:
    // Serial.printf("[WSc] Disconnected!\n");
    break;
  case WStype_CONNECTED:
  {
    // Serial.printf("[WSc] Connected to url: %s\n", payload);

    // send message to server when Connected
    webSocket.sendTXT("Connected");
  }
  break;
  case WStype_TEXT:
    //Serial.printf("[WSc] get text: %s\n", payload);
    Serial.printf("%s", payload);
    // send message to server
    // webSocket.sendTXT("message here");
    break;
  case WStype_BIN:
    //Serial.printf("[WSc] get binary length: %u\n", length);
    hexdump(payload, length);

    // send data to server
    // webSocket.sendBIN(payload, length);
    break;
  case WStype_ERROR:
    webSocket.disconnect();
    break;
  }
}
void setup()
{
  Serial.begin(115200);
  delay(10);
  Serial.setDebugOutput(true);
  // We start by connecting to a WiFi network
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);

  while (WiFiMulti.run() != WL_CONNECTED)
  {
    delay(500);
  }

  delay(500);

  // server address, port and URL

  webSocket.begin(WS_IP, WS_PORT, "/");

  // event handler
  webSocket.onEvent(webSocketEvent);

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);
}

void loop()
{
  webSocket.loop();
  // 读串口的信息
  if (Serial.available() > 0)
  {
    delay(100);
    receiveSerialData = Serial.readString();
    webSocket.sendTXT(receiveSerialData);
  }
  receiveSerialData = "";
}
