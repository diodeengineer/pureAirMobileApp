// components/GraphScreen.js

import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Vibration, 
  Switch 
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "./ThemeContext";
import { Audio } from "expo-av";
import { useAlerts } from "./AlertContext";
import { WS_URL} from "@env";



const screenWidth = Dimensions.get("window").width;

export default function GraphScreen() {
  const { isDark, toggleAlerts } = useTheme();
 const { alertsEnabled, setAlertsEnabled } = useAlerts(); 

  const [data, setData] = useState([0]); // PPM values
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("🔴 Disconnected");
  const [alertActive, setAlertActive] = useState(false);
  const soundRef = useRef(null);

  
  const playAlertSound = async () => {
    if (!alertsEnabled) return;

    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/alert.mp3")
      );
      soundRef.current = sound;
    }
    await soundRef.current.replayAsync();
  };

  // cleanup on toggle off
  useEffect(() => {
    if (!alertsEnabled) {
      if (soundRef.current) {
        soundRef.current.stopAsync();
      }
      Vibration.cancel();
    }
  }, [alertsEnabled]);

  useEffect(() => {
const socket = new WebSocket(WS_URL)

    socket.onopen = () => {
      setStatus("🟢 Connected");
      console.log("* WebSocket connected");
    };

    socket.onmessage = (event) => {
      console.log("! From server:", event.data);
      setMessages((prev) => [event.data, ...prev]);

      const matches = event.data.match(/Value: (\d+(\.\d+)?)/);
      if (matches && matches[1]) {
        const value = parseFloat(matches[1]);
        if (!isNaN(value)) {
          setData((prev) => [...prev.slice(-19), value]);

          //Threshold value of ppm
          if (value >= 60) {
            // always show danger box
            setAlertActive(true);

            // sound & vibration only if alerts are enabled
            if (alertsEnabled) {
              Vibration.vibrate([500, 500, 500], false);
              playAlertSound();
            }
          } else {
            // reset danger box
            setAlertActive(false);

            // stop sound/vibration
            if (soundRef.current) {
              soundRef.current.stopAsync();
            }
            Vibration.cancel();
          }
        }
      }
    };

    socket.onclose = () => {
      setStatus("🔴 Disconnected");
      console.log("x WebSocket closed");
    };

    return () => socket.close();
  }, [alertsEnabled]);

  // Chart data
  const chartData = {
    datasets: [{ data }],
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#101820" : "#fff" }]}>
      <Text style={[styles.status, { color: isDark ? "#0f0" : "#080" }]}>{status}</Text>

      {/* alert box only when active */}
      {alertActive && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>⚠️ Danger! High PPM</Text>
        </View>
      )}

      
      {/* Chart */}
      <Text style={[styles.chartTitle, { color: isDark ? "#fff" : "#000" }]}>
        Concentration (PPM) vs Time
      </Text>

      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={250}
        bezier
        chartConfig={{
          backgroundGradientFrom: isDark ? "#0f2027" : "#e3f2fd",
          backgroundGradientTo: isDark ? "#203a43" : "#ffffff",
          decimalPlaces: 2,
          color: () => "#4cafef",
          labelColor: () => (isDark ? "#fff" : "#000"),
          propsForDots: { r: "3", strokeWidth: "2", stroke: "#4cafef" },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
        formatXLabel={(val) => `t${val}`}
      />
{/* 
 Just for printing data in mobile app */}

      {/* <ScrollView style={styles.messages}>
        {messages.map((msg, idx) => (
          <Text key={idx} style={[styles.msg, { color: isDark ? "#fff" : "#000" }]}>
            {/* {msg} */}
          {/* </Text> */}
        {/* ))} */}
      {/* </ScrollView>  */} 
     


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  status: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  chartTitle: { fontSize: 16, fontWeight: "600", textAlign: "center", marginBottom: 8 },
  messages: { flex: 1, marginTop: 10 },
  msg: { fontSize: 14, marginVertical: 2 },
  alertBox: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  alertText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
