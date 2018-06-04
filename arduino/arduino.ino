#include <dht11.h>
#define DHT11PIN 8
#define LEDPIN 7
dht11 DHT11;
String receiveSerialData = "";
void setup()
{
  Serial.begin(115200);
}

void loop()
{
  int result = DHT11.read(DHT11PIN);
  // 发送温湿度数据给串口(ESP8266)
  Serial.print(DHT11.humidity + ' ' + DHT11.temperature);
  // 读取从串口(ESP8266)传过来的数据
  if (Serial.available() > 0)
  {
    receiveSerialData = Serial.readString();
    // 判断指令
    if (receiveSerialData == "openLED")
    {
      digitalWrite(LEDPIN，HIGH);
    }
    else if (receiveSerialData == "closeLED")
    {
      digitalWrite(LEDPIN，LOW);
    }
  }
  receiveSerialData = "";
  delay(2000);
}
