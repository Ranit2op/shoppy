import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const [ordering, setOrdering] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + tax;

  const handleRemove = (item: any) => {
    Alert.alert("Remove Item", `Remove "${item.title}" from your cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(item.id),
      },
    ]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setOrdering(true);
    const orderId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      setOrdering(false);
      clearCart();
      Alert.alert(
        "Order Placed! 🎉",
        `Your order #${orderId} for ₹${grandTotal} has been successfully placed with Cash on Delivery.\n\nEstimated delivery: 2-3 business days.`,
        [
          {
            text: "Continue Shopping",
            onPress: () => router.push("/"),
          },
        ]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Cart" showBackButton={true} />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your cart is empty!</Text>
          <Text style={styles.emptyText}>
            Looks like you haven't added anything to your cart yet. Explore thousands of deals on Shoppy!
          </Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push("/")}>
            <Text style={styles.exploreBtnText}>Start Shopping ➔</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.content}>
            {/* Delivery Banner */}
            <View style={styles.freeDeliveryBanner}>
              {deliveryFee === 0 ? (
                <Text style={styles.freeDeliveryText}>🎉 You unlocked FREE Delivery!</Text>
              ) : (
                <Text style={styles.freeDeliveryText}>
                  Add ₹{499 - subtotal} more to get <Text style={{ fontWeight: "bold" }}>FREE Delivery</Text>!
                </Text>
              )}
            </View>

            {/* Cart Items List */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Cart Items ({cartItems.length})</Text>
                <TouchableOpacity onPress={clearCart}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {cartItems.map((item: any) => (
                <View key={item.id} style={styles.item}>
                  <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />

                  <View style={styles.details}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.unitPrice}>₹{item.price} each</Text>

                    <View style={styles.actionsRow}>
                      <View style={styles.stepper}>
                        <TouchableOpacity
                          style={styles.stepperBtn}
                          onPress={() => updateQuantity(item.id, -1)}
                        >
                          <Text style={styles.stepperBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.stepperQty}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepperBtn}
                          onPress={() => updateQuantity(item.id, 1)}
                        >
                          <Text style={styles.stepperBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => handleRemove(item)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* Bill Summary */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Bill Breakdown</Text>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Subtotal</Text>
                <Text style={styles.billValue}>₹{subtotal}</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery Charges</Text>
                {deliveryFee === 0 ? (
                  <Text style={styles.freeText}>FREE</Text>
                ) : (
                  <Text style={styles.billValue}>₹{deliveryFee}</Text>
                )}
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>GST & Packaging (5%)</Text>
                <Text style={styles.billValue}>₹{tax}</Text>
              </View>

              <View style={[styles.billRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>Total Amount</Text>
                <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Checkout Action Bar */}
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.barLabel}>Total Payable</Text>
              <Text style={styles.barTotal}>₹{grandTotal}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              disabled={ordering}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>
                {ordering ? "Placing Order..." : "Place Order ➔"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 14,
    paddingBottom: 95,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  exploreBtn: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  freeDeliveryBanner: {
    backgroundColor: "#ECFDF5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  freeDeliveryText: {
    color: "#059669",
    fontSize: 13,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
  },
  clearText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4F46E5",
    borderRadius: 6,
    overflow: "hidden",
  },
  stepperBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#EEF2FF",
  },
  stepperBtnText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "bold",
  },
  stepperQty: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: "bold",
    color: "#1F2937",
  },
  removeBtn: {
    padding: 4,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4F46E5",
    marginLeft: 10,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  billValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  freeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#059669",
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 10,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  grandTotalValue: {
    fontSize: 19,
    fontWeight: "900",
    color: "#4F46E5",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 8,
  },
  barLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
  },
  barTotal: {
    fontSize: 20,
    fontWeight: "900",
    color: "#4F46E5",
  },
  checkoutBtn: {
    backgroundColor: "#4F46E5",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
