
// App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/HomeScreen";
import SettingsScreen from "./components/SettingScreen";
import { ThemeProvider } from "./components/ThemeContext";
import GraphScreen from "./components/GraphScreen";
import { AlertProvider } from "./components/AlertContext";
import { MqttProvider } from "./components/MqttContext";


const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <MqttProvider>

        
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Graph" component={GraphScreen} />

        </Stack.Navigator>
      </NavigationContainer>
      </MqttProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}



