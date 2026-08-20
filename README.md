**Pizza App — Frontend**

- **Description:** A React + Vite frontend for a pizza ordering application. It provides product listing, product details, authentication (signup/login), cart management, order placement, and an admin area to add products. The app uses Redux Toolkit for state management and Axios for communicating with a backend API.

**Features**
- **Product Catalog:** Browse pizzas and view `ProductDetails` pages.
- **Cart:** Add/remove items, view `CartDetails`, and proceed to order.
- **Authentication:** Signup and Login pages with protected routes via `RequireAuth`.
- **Ordering:** Place orders and view an order success confirmation.
- **Admin:** Add products (Admin/Addproduct.jsx) — guarded by admin state slice.
- **Notifications:** User feedback via `react-hot-toast`.

**Tech Stack**
- **Framework:** React 18 + Vite
- **State:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing:** `react-router-dom` v6
- **HTTP:** `axios` (configured in [src/Helpers/axiosInstance.js](src/Helpers/axiosInstance.js#L1-L40)) — uses environment variable `VITE_BACKEND_URL`.
- **Styling:** Tailwind CSS
- **Tooling:** ESLint, Vite dev server

**Quick Start**
1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (at project root) and set the backend base URL:

```
VITE_BACKEND_URL=https://api.example.com
```

3. Run the dev server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

**Project Structure (high level)**
- **public/** — static assets
- **src/** — main source
- **src/Pages/** — top-level pages (`Home`, `Products`, `Cart`, `Order`, auth pages, admin pages)
- **src/Components/** — UI components and icons
- **src/Redux/** — store and feature slices (`AuthSlice`, `CartSlice`, `ProductSlice`, `OrderSlice`, `AdminSlice`)
- **src/Helpers/axiosInstance.js** — Axios instance with auth token interceptor and `VITE_BACKEND_URL` (see link above)

**Notes & Next Steps**
- Ensure the backend accepts CORS and cookies if `withCredentials` is required.
- Replace `VITE_BACKEND_URL` with your backend endpoint before running.

---

If you want, I can also add a short `CONTRIBUTING` section or example environment files. 