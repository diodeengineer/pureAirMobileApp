
// components/MqttContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { WS_URL} from "@env";


const MqttContext = createContext();

export const MqttProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ MQTT WebSocket connected");
      setConnected(true);
    };

    socket.onclose = () => {
      console.log("x MQTT WebSocket disconnected");
      setConnected(false);
    };

    socket.onerror = () => {
      console.log("! MQTT WebSocket error");
      setConnected(false);
    };

    return () => socket.close();
  }, []);

  const sendMessage = (msg) => {
    if (socketRef.current && connected) {
      socketRef.current.send(msg);
    }
  };

  return (
    <MqttContext.Provider value={{ connected, sendMessage }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => useContext(MqttContext);
