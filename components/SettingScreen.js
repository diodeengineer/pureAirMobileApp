
// components/SettingScreen.js

import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TextInput,Linking } from "react-native";
import { useTheme } from "./ThemeContext";
import { useAlerts } from "./AlertContext";
import ConnectDevice from "./ConnectDevice";
import {DOC_LINK, LIC_LINK} from "@env"


export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [alerts, setAlerts] = useState(true);
const { alertsEnabled, setAlertsEnabled } = useAlerts();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#101820" : "#f9f9f9" }]}>
       
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>⚙️ Settings</Text>
 <ConnectDevice />
      <View style={styles.row}>
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      

      {/* Sound Alerts toggle - useing global context */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
          Sound Alerts
        </Text>
        <Switch
          value={alertsEnabled}
          onValueChange={setAlertsEnabled} // updates global state
        />
      </View>


<View
  style={[
    styles.card,
    { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5" },
  ]}
>
  <Text style={[styles.cardTitle, { color: isDark ? "#fff" : "#000" }]}>
    🌬️ PureAir Monitor
  </Text>
  <Text style={[styles.cardDesc, { color: isDark ? "#aaa" : "#333" }]}>
    Version 1.0.0
  </Text>
  <Text style={[styles.cardDesc, { color: isDark ? "#aaa" : "#333" }]}>
    Developed by Dilip
  </Text>
  <Text
    style={[
      styles.cardDesc,
      { color: isDark ? "#4cafef" : "#1976d2", textDecorationLine: "underline" },
    ]}
    onPress={() => Linking.openURL(DOC_LINK)}
  >
    Documentation / Tutorial
  </Text>
  
  
  <Text
  style={[
    styles.cardDesc,
    { color: isDark ? "#4cafef" : "#1976d2", textDecorationLine: "underline" },
  ]}
  onPress={() => Linking.openURL(LIC_LINK)}
>
  📜 Licensed under MIT
</Text>


</View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  label: { fontSize: 18 },
  input: { padding: 8, borderRadius: 8, width: 150, textAlign: "center" },


  card: {
  padding: 30,
  borderRadius: 20,
  marginVertical: 12,
  width: "100%",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 5,
},
cardTitle: {
  fontSize: 20,
  fontWeight: "600",
  marginBottom: 6,
},
cardDesc: {
  fontSize: 14,
  marginVertical: 2,
  textAlign: "center",
},

});

