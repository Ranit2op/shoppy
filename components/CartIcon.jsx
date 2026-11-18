import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext";
import { ShoppingBag } from "react-native-feather";

export default function CartIcon() {
  const { getItemsCount, loading } = useCart();
  const router = useRouter();

  const itemsCount = loading ? 0 : getItemsCount();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push("/Cart")}
      activeOpacity={0.8}
    >
      <View style={styles.iconCircle}>
        <ShoppingBag stroke="#4F46E5" width={20} height={20} />
      </View>
      {itemsCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemsCount > 99 ? "99+" : itemsCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    position: "relative",
  },
  iconCircle: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
