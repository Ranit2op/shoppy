import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { fetchProductById } from "../../services/api";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const data = await fetchProductById(id);
      if (isMounted) {
        setProduct(data);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const inrPrice = product ? product.priceInINR || Math.round(product.price * 85) : 0;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    Alert.alert("Added to Cart! 🛍️", `${quantity}x ${product.title} added to your cart.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push("/Cart");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" showBackButton={true} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Product Details" showBackButton={true} />
        <View style={styles.loaderContainer}>
          <Text style={styles.errorText}>Product not found or unavailable.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Product Details" showBackButton={true} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Image Box */}
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
          {product.discount ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          ) : null}
        </View>

        {/* Info Box */}
        <View style={styles.infoContainer}>
          <Text style={styles.categoryBadge}>{product.category?.toUpperCase()}</Text>
          <Text style={styles.title}>{product.title}</Text>

          {product.rating && (
            <View style={styles.ratingRow}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingStar}>⭐ {product.rating.rate || 4.2}</Text>
              </View>
              <Text style={styles.ratingCount}>({product.rating.count || 120} customer ratings)</Text>
            </View>
          )}

          {/* Pricing Row */}
          <View style={styles.pricingCard}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{inrPrice}</Text>
                {product.discount ? (
                  <Text style={styles.originalPrice}>₹{Math.round(inrPrice * 1.3)}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperQty}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Product Overview</Text>
            <Text style={styles.desc}>{product.description}</Text>
          </View>

          {/* Highlights */}
          <View style={styles.perksRow}>
            <View style={styles.perkItem}>
              <Text style={styles.perkIcon}>🚚</Text>
              <Text style={styles.perkText}>Fast Shipping</Text>
            </View>
            <View style={styles.perkItem}>
              <Text style={styles.perkIcon}>🛡️</Text>
              <Text style={styles.perkText}>Genuine Product</Text>
            </View>
            <View style={styles.perkItem}>
              <Text style={styles.perkIcon}>🔄</Text>
              <Text style={styles.perkText}>7-Day Returns</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart} activeOpacity={0.85}>
          <Ionicons name="cart-outline" size={20} color="#4F46E5" style={{ marginRight: 6 }} />
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow} activeOpacity={0.85}>
          <Text style={styles.buyButtonText}>Buy Now ⚡</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    paddingBottom: 90,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imageCard: {
    backgroundColor: "#fff",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 16,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4F46E5",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1F2937",
    lineHeight: 26,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingStar: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 13,
  },
  ratingCount: {
    color: "#6B7280",
    fontSize: 13,
  },
  pricingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "900",
    color: "#4F46E5",
  },
  originalPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#4F46E5",
    borderRadius: 8,
    overflow: "hidden",
  },
  stepperBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#EEF2FF",
  },
  stepperBtnText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepperQty: {
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: "bold",
    color: "#1F2937",
  },
  descSection: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  descTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
  perksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  perkItem: {
    alignItems: "center",
    flex: 1,
  },
  perkIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  perkText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "600",
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
    gap: 12,
    elevation: 8,
  },
  cartButton: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    borderWidth: 1.5,
    borderColor: "#4F46E5",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  cartButtonText: {
    color: "#4F46E5",
    fontSize: 15,
    fontWeight: "bold",
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#4F46E5",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
