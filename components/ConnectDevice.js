
// components/ConnectDevice.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";

export default function ConnectDevice({ espId }) {
  const { isDark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleConnect = async () => {
    if (!ssid || !password) return;
    setConnecting(true);
    setStatus("Connecting...");

    try {
      // yet to validate
      const res = await fetch("http://192.168.4.1/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid, password }),
      });
      const data = await res.json();
      if (data.success) setStatus("Connected ✅");
      else setStatus("Failed x");
    } catch (err) {
      setStatus("Failed x");
    } finally {
      setConnecting(false);
    }
  };

  const isButtonDisabled = !ssid || !password || connecting;

  return (
    <View style={{ marginVertical: 20, width: "100%", alignItems: "center" }}>
      
      {/* esp infoo */}
      <View style={[styles.espCard, { backgroundColor: isDark ? "#1e2a38" : "#f0f0f0" }]}>
        <Text style={[styles.espTitle, { color: isDark ? "#fff" : "#000" }]}>
          PureAir Device ID: {espId || "Unknown"}
        </Text>
        <Text style={[styles.espDesc, { color: isDark ? "#ccc" : "#555" }]}>
          Connect your phone to this Wi-Fi to configure
        </Text>
      </View>

      {/* toggle form */}
      <TouchableOpacity
        style={[styles.card, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5" }]}
        onPress={() => setShowForm(!showForm)}
      >
        <Text style={[styles.cardTitle, { color: isDark ? "#fff" : "#000" }]}>
          + Configure Device
        </Text>
      </TouchableOpacity>

      {/* form */}
      {showForm && (
        <View style={[styles.formContainer, { backgroundColor: isDark ? "#121f2a" : "#fafafa" }]}>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? "#1e2a38" : "#e0e0e0", color: isDark ? "#fff" : "#000" }]}
            placeholder="Home Wi-Fi SSID"
            placeholderTextColor={isDark ? "#888" : "#666"}
            value={ssid}
            onChangeText={setSsid}
          />

          <View style={{ width: "100%", marginBottom: 16 }}>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? "#1e2a38" : "#e0e0e0", color: isDark ? "#fff" : "#000", paddingRight: 45 }]}
              placeholder="Home Wi-Fi Password"
              placeholderTextColor={isDark ? "#888" : "#666"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 10, top: 12 }}
              onPress={() => setShowPassword(prev => !prev)}
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: isButtonDisabled ? "#888" : "#4cafef" }]}
            onPress={handleConnect}
            disabled={isButtonDisabled}
          >
            <Text style={styles.buttonText}>
              {connecting ? "Connecting..." : "Send Credentials"}
            </Text>
          </TouchableOpacity>

          {status ? (
            <Text style={[styles.status, { color: isDark ? "#4cafef" : "#1976d2" }]}>{status}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  espCard: {
    padding: 16,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  espTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  espDesc: { fontSize: 14, textAlign: "center" },

  card: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },

  formContainer: {
    width: "100%",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    width: "95%",
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
    width: "60%",
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  status: { marginTop: 12, fontSize: 16 },
});
