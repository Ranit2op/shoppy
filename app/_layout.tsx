import "react-native-reanimated";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "../context/CartContext";

// Prevent splash screen from hiding prematurely
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  useEffect(() => {
    // Dismiss splash screen immediately on mount with safety fallback
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // ignore if already hidden
      }
    };
    
    // Quick tick to allow React hierarchy to paint
    const timer = setTimeout(hideSplash, 150);
    return () => clearTimeout(timer);
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
