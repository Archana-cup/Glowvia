import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ToastProvider } from './contexts/ToastContext'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/routes/ProtectedRoute'
import { AdminRoute } from './components/routes/AdminRoute'

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'

// Store Pages
import { HomePage } from './pages/home/HomePage'
import { ProductsPage } from './pages/products/ProductsPage'
import { ProductDetailPage } from './pages/products/ProductDetailPage'
import { CategoryProductsPage } from './pages/products/CategoryProductsPage'
import { SearchPage } from './pages/products/SearchPage'

// Shopping Pages
import { CartPage } from './pages/cart/CartPage'
import { WishlistPage } from './pages/wishlist/WishlistPage'
import { CheckoutPage } from './pages/checkout/CheckoutPage'
import { OrderSuccessPage } from './pages/checkout/OrderSuccessPage'

// Customer Account Pages
import { AccountOverviewPage } from './pages/account/AccountOverviewPage'
import { ProfilePage } from './pages/account/ProfilePage'
import { AddressesPage } from './pages/account/AddressesPage'
import { OrdersPage } from './pages/account/OrdersPage'
import { OrderDetailPage } from './pages/account/OrderDetailPage'

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage'

// Informational & 404 Pages
import { AboutPage } from './pages/informational/AboutPage'
import { ContactPage } from './pages/informational/ContactPage'
import { FAQPage } from './pages/informational/FAQPage'
import { PrivacyPolicyPage } from './pages/informational/PrivacyPolicyPage'
import { TermsPage } from './pages/informational/TermsPage'
import { NotFoundPage } from './pages/NotFoundPage'

/**
 * Root Route handler ensuring unauthenticated visitors see the Login Screen first,
 * as requested in section 5 & 8 of the project specifications.
 */
function RootHomeGate() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const isGuestMode = new URLSearchParams(location.search).get('guest') === 'true'

  if (loading) {
    return null
  }

  // If user is not logged in and hasn't explicitly clicked "Continue browsing as guest",
  // direct them to the Login screen first.
  if (!user && !isGuestMode) {
    return <Navigate to="/login" replace />
  }

  return <HomePage />
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* Standalone Authentication Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Main Storefront Layout */}
                <Route element={<MainLayout />}>
                  {/* Public Store Pages */}
                  <Route path="/" element={<RootHomeGate />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/categories/:category" element={<CategoryProductsPage />} />
                  <Route path="/search" element={<SearchPage />} />

                  {/* Shopping flow */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />

                  {/* Informational Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Customer Account Pages (Protected) */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <AccountOverviewPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/addresses"
                    element={
                      <ProtectedRoute>
                        <AddressesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account/orders/:id"
                    element={
                      <ProtectedRoute>
                        <OrderDetailPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Management Pages (Admin Protected) */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminRoute>
                        <AdminProductsPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/new"
                    element={
                      <AdminRoute>
                        <AdminProductFormPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/products/:id/edit"
                    element={
                      <AdminRoute>
                        <AdminProductFormPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <AdminOrdersPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <AdminRoute>
                        <AdminCategoriesPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <AdminRoute>
                        <AdminCustomersPage />
                      </AdminRoute>
                    }
                  />

                  {/* 404 Catch-All Page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
