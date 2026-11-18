import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { NativeModules } from "react-native";

const { Calculator } = NativeModules;

export default function CalculatorScreen() {
  const [result, setResult] = useState("Waiting...");

  // useEffect শুধু উদাহরণের জন্য (অটো রান)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await Calculator.multiply(6, 7);
        setResult("On load 6 x 7 = " + res);
      } catch (e) {
        setResult("Error on load: " + e.message);
      }
    };
    run();
  }, []);

  const doAdd = async () => {
    try {
      const res = await Calculator.add(10, 5);
      setResult("10 + 5 = " + res);
    } catch (e) {
      setResult("Error: " + e.message);
    }
  };

  const doSubtract = async () => {
    try {
      const res = await Calculator.subtract(9, 4);
      setResult("9 - 4 = " + res);
    } catch (e) {
      setResult("Error: " + e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Add 10+5" onPress={doAdd} />
      <Button title="Subtract 9-4" onPress={doSubtract} />
      <Text style={{ fontSize: 22, marginTop: 20 }}>{result}</Text>
    </View>
  );
}