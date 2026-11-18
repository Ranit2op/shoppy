import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { fetchAllProducts, fetchProductsByCategory } from "../services/api";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  { id: "all", name: "All", icon: "grid-outline" as const },
  { id: "electronics", name: "Electronics", icon: "hardware-chip-outline" as const },
  { id: "jewelery", name: "Jewelery", icon: "diamond-outline" as const },
  { id: "men's clothing", name: "Men", icon: "shirt-outline" as const },
  { id: "women's clothing", name: "Women", icon: "sparkles-outline" as const },
];

export default function Home() {
  const router = useRouter();
  const { getItemsCount, getTotalPrice } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadProducts = useCallback(async (cat = "all") => {
    setLoading(true);
    const data = await fetchProductsByCategory(cat);
    setProducts(data || []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadProducts("all");
  }, [loadProducts]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSearchQuery("");
    loadProducts(catId);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts(selectedCategory);
  };

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartCount = getItemsCount();
  const totalPrice = getTotalPrice();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Shoppy" />

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products, brands, electronics..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Super Deals Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.discountBanner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTag}>⚡ FLASH SALE</Text>
            <Text style={styles.discountText}>Up to 50% OFF</Text>
            <Text style={styles.bannerSubtitle}>Free Delivery on your first order!</Text>
          </View>
          <View style={styles.bannerIconBox}>
            <Text style={{ fontSize: 32 }}>🎁</Text>
          </View>
        </View>
      </View>

      {/* Category Horizontal Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                onPress={() => handleCategorySelect(cat.id)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={cat.icon}
                  size={20}
                  color={isSelected ? "#fff" : "#4F46E5"}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Product Grid / Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingMsg}>Loading products...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySub}>Try searching for something else or pick another category.</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => {
              setSearchQuery("");
              handleCategorySelect("all");
            }}
          >
            <Text style={styles.resetBtnText}>Show All Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[styles.list, cartCount > 0 && { paddingBottom: 85 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#4F46E5"]} />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          )}
        />
      )}

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity
            style={styles.floatingCartBar}
            onPress={() => router.push("/Cart")}
            activeOpacity={0.9}
          >
            <View>
              <Text style={styles.floatingCartCount}>{cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}</Text>
              <Text style={styles.floatingCartPrice}>₹{totalPrice}</Text>
            </View>
            <View style={styles.floatingCartRight}>
              <Text style={styles.floatingCartAction}>View Cart ➔</Text>
            </View>
          </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
  },
  bannerContainer: {
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  discountBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    elevation: 3,
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTag: {
    color: "#FDE047",
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  discountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },
  bannerSubtitle: {
    color: "#E0E7FF",
    fontSize: 11,
    marginTop: 2,
  },
  bannerIconBox: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
    borderRadius: 30,
  },
  categoryContainer: {
    marginBottom: 6,
  },
  categoryScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  categoryCardActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  categoryTextActive: {
    color: "#fff",
  },
  list: {
    paddingHorizontal: 9,
    paddingTop: 6,
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  loadingMsg: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  floatingCartContainer: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
  },
  floatingCartBar: {
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  floatingCartCount: {
    color: "#D1FAE5",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  floatingCartPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  floatingCartRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  floatingCartAction: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
