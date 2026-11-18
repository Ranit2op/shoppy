import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onPress }) {
  const { addToCart } = useCart();
  const inrPrice = product.priceInINR || Math.round(product.price * 85);

  const handleQuickAdd = (e) => {
    addToCart(product, 1);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.88}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        {product.discount ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}% OFF</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.categoryText} numberOfLines={1}>
          {product.category?.toUpperCase()}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        {product.rating ? (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>⭐ {product.rating.rate || 4.2} ({product.rating.count || 50})</Text>
          </View>
        ) : null}

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.price}>₹{inrPrice}</Text>
            {product.discount ? (
              <Text style={styles.originalPrice}>₹{Math.round(inrPrice * 1.3)}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleQuickAdd} activeOpacity={0.75}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: 6,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#DC2626",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 8,
    flex: 1,
    justifyContent: "space-between",
  },
  categoryText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 18,
    marginBottom: 4,
    height: 36,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4F46E5",
  },
  originalPrice: {
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  addBtn: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#4F46E5",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#4F46E5",
    fontSize: 12,
    fontWeight: "800",
  },
});
