# 🛍️ Shoppy - Smart Shopping E-Commerce Mobile App

[![Download APK](https://img.shields.io/badge/Download-Shoppy%20APK%20(v1.0.0)-brightgreen?style=for-the-badge&logo=android)](https://github.com/Ranit2op/shoppy/releases/download/v1.0.0/Shoppy-v1.0.0.apk)
[![Release](https://img.shields.io/github/v/release/Ranit2op/shoppy?style=for-the-badge&color=blue)](https://github.com/Ranit2op/shoppy/releases)

A modern, fast, and feature-rich E-Commerce mobile shopping application built with **React Native** and **Expo SDK 52**. Powered by reliable real-time product APIs.

---

## ✨ Features

- 🛒 **Explore Products:** Browse thousands of trending items across multiple categories (Electronics, Fashion, Jewelery, and more).
- 🔍 **Real-time Search:** Instant keyword search across all products and categories.
- ⚡ **Flash Deals & Discounts:** Dynamic product discount badges with up to 50% OFF offers.
- 🛍️ **Cart System:** Add items to cart, modify quantities (`+` / `-`), view item totals, and remove items with confirmation alerts.
- 📦 **Free Delivery Perks:** Free delivery progress banner on orders above ₹499.
- 💳 **Smooth Checkout:** Order summary, bill breakdown (Item Total, Delivery Fee, Taxes), and instant order placement with confirmation.
- 🎨 **Modern UI/UX:** Clean indigo-purple theme, custom 3D glossy shopping bag mascot icon, and custom splash screen.

---

## 🛠️ Tech Stack

- **Framework:** React Native (0.76.9) & Expo SDK 52
- **Router:** Expo Router (File-based routing)
- **State Management:** React Context API & `@react-native-async-storage/async-storage`
- **Native Platform:** Android (Gradle, Kotlin, Java 17)
- **APIs:** FakeStoreAPI & DummyJSON

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Ranit2op/shoppy.git
cd shoppy

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npx expo start
```
- Press `a` for Android Emulator / Phone (via Expo Go)
- Press `w` for Web preview

---

## 📱 Build Standalone Android APK

```bash
# Build release APK
cd android
.\gradlew.bat assembleRelease
```

The output APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```


