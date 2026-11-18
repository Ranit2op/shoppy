import "react-native-reanimated";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "../context/CartContext";

export default function Layout() {
  useEffect(() => {
    // Unconditionally hide native splash screen immediately on mount
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar style="light" backgroundColor="#4F46E5" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="Cart" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </SafeAreaProvider>
  );
}
