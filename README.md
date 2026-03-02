[🇷🇺 Читать на русском языке](./README.ru.md)

---

# Sklad PRO AI — Intelligent Warehouse Management System

![Angular](https://img.shields.io)
![TypeScript](https://img.shields.io)
![Signals](https://img.shields.io)
![AI](https://img.shields.io)

## 🚀 Project Overview
**Sklad PRO AI** is a professional-grade warehouse management ecosystem. Originally built with Vue 3, this repository represents a complete migration to **Angular 21**, focusing on high-performance reactivity, strict typing, and modular architecture.

The system manages inventory, warehouse transfers, and stock arrivals, integrated with a **Python DRF** backend and **Gemini AI** for real-time inventory analytics.

---

## 🛠 Technical Stack
-   **Frontend Framework**: Angular 21 (Standalone Architecture)
-   **State Management**: Angular Signals (Fine-grained reactivity)
-   **Security**: JWT Auth with Mandatory Password Change flow
-   **Styling**: Bootstrap 5.3 + SCSS (Original SVG iconography)
-   **Communication**: HttpClient with RxJS & Functional Interceptors
-   **AI Integration**: Custom AI module for stock recommendations

---

## 🏗 Architectural Highlights (The "Senior" Approach)
This project was migrated with an "Enterprise-First" mindset:

1.  **Signals over Observables**: Leveraging **Angular Signals** for UI state to reduce change detection cycles and improve performance.
2.  **Mandatory Security Flow**: Implementation of a "Temporary Password" activation system. Users are forced to change passwords on first login via a secure Interceptor-led UI transition.
3.  **Advanced Staff Management**: A dedicated Admin module where administrators register users with separate **Username** and **Full Name** fields, featuring automated temporary password generation.
4.  **Functional Interceptors**: A global `AuthInterceptor` handles JWT injection and 401/403 error handling.
5.  **Clean Code & SOLID**: Strict separation between Core Services, Feature Components, and Shared UI elements.

---

## 🤖 AI Features
The system includes a dedicated **AI Analyst** that:
*   Analyzes current stock levels across all warehouses.
*   Provides replenishment recommendations based on transfer history.
*   Handles AI service outages gracefully without interrupting the core workflow.

---

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com
    cd sklad-pro-angular
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the Development Server:**
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

---

## 🔄 Migration Journey: Vue to Angular
This project demonstrates the ability to translate complex logic between frameworks:
*   **Reactivity**: Migrated from Vue `ref/computed` to Angular `signal/computed`.
*   **Directives**: Transitioned from `v-if/v-for` to Angular's modern `@if/@for` control flow.
*   **Service Layer**: Replaced Axios with Angular's `HttpClient`, leveraging Dependency Injection for better testability.

---

## 👨‍💻 Developer
**Zakiryanov M.M.**
*Modern Fullstack Developer (Backend & Frontend)*