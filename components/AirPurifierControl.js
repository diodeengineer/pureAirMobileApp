// components/AirPurifierControl.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Power } from "lucide-react-native";
import { API_BASE, WS_URL } from "@env";


export default function AirPurifierControl() {
  const [isOn, setIsOn] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  const wsRef = useRef(null);

  // --- Setup WebSocket ---
  useEffect(() => {
    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => console.log("! WS connected");
    wsRef.current.onclose = () => console.log("x WS disconnected");

    wsRef.current.onmessage = (event) => {
      try {
        const { topic, message } = JSON.parse(event.data);

        if (topic === "purifier/state") setIsOn(message === "ON");
        if (topic === "purifier/status") setDeviceOnline(message === "ONLINE");
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    return () => wsRef.current.close();
  }, []);

  // Toggle purifier via REST 
  const togglePurifier = async () => {
    if (!deviceOnline) return Alert.alert("Device offline x");

    try {
      setLoading(true);
      const endpoint = isOn ? `${API_BASE}/purifier/off` : `${API_BASE}/purifier/on`;

      const res = await fetch(endpoint, { method: "POST" });
      if (!res.ok) throw new Error("Request failed");

      // Optimistic update, will be corrected by ws if needed
      setIsOn(!isOn);
    } catch (err) {
      console.error(err);
      Alert.alert("Error x", "Could not update purifier state");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: deviceOnline ? "#203a43" : "#555" }]}>
      <Text style={styles.title}>🌀 Air Purifier Control</Text>
      <Text style={[styles.status, { color: isOn ? "limegreen" : "red" }]}>
        {deviceOnline ? (isOn ? "Running" : "Stopped") : "Offline"}
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isOn ? "#f44336" : "#4caf50", opacity: deviceOnline ? 1 : 0.5 },
        ]}
        onPress={togglePurifier}
        disabled={loading || !deviceOnline}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Power size={22} color="#fff" />
            <Text style={styles.buttonText}>{isOn ? "Turn OFF" : "Turn ON"}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 20,
    marginVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8, color: "#fff" },
  status: { fontSize: 16, marginBottom: 16, color: "#fff" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 8, fontWeight: "600" },
});
