
// components/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import AirPurifierControl from "./AirPurifierControl";

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();

  return (
    <LinearGradient
      colors={isDark ? ["#0f2027", "#203a43", "#2c5364"] : ["#e3f2fd", "#ffffff"]}
      style={styles.bg}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
          🌬️ PureAir Monitor
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? "#ccc" : "#555" }]}>
          Your real-time air quality dashboard
        </Text>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5" }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Graph")}
        >
          <Ionicons name="pulse-outline" size={40} color="#4cafef" />
          <Text style={[styles.cardTitle, { color: isDark ? "#fff" : "#000" }]}>Live Data</Text>
          <Text style={[styles.cardDesc, { color: isDark ? "#aaa" : "#333" }]}>
            View real-time sensor data
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5" }]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="lightbulb-on-outline" size={40} color="#fbc02d" />
          <Text style={[styles.cardTitle, { color: isDark ? "#fff" : "#000" }]}>Air Purifier Control</Text>
         
         
  <AirPurifierControl />


        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5" }]}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings-outline" size={40} color={isDark ? "#90caf9" : "#1976d2"} />
          <Text style={[styles.cardTitle, { color: isDark ? "#fff" : "#000" }]}>Settings</Text>
          <Text style={[styles.cardDesc, { color: isDark ? "#aaa" : "#333" }]}>
            Configure app & device options
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 2, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 50, marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: "center" },
  card: {
    padding: 20,
    borderRadius: 20,
    marginVertical: 12,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: { fontSize: 20, fontWeight: "600", marginTop: 10 },
  cardDesc: { fontSize: 14, marginTop: 4, textAlign: "center" },
});
