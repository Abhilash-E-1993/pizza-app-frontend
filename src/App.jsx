import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster, toast } from 'react-hot-toast'
import './App.css'
import axiosInstance from './Helpers/axiosInstance'
import { verifyAuth, forceLogout } from './Redux/Slices/AuthSlice'
import RequireAuth from './Components/Auth/RequireAuth'
import Pizzalogo from './assets/images/pizzaLogo.png'

// Landing page stays eager for a fast first paint; everything else is
// code-split so the initial bundle stays small.
import Home from './Pages/Home'

const Signup = lazy(() => import('./Pages/Auth/Signup'))
const Login = lazy(() => import('./Pages/Auth/Login'))
const NotFound = lazy(() => import('./Pages/NotFound'))
const Denied = lazy(() => import('./Pages/Denied'))
const Addproduct = lazy(() => import('./Pages/Admin/Addproduct'))
const ProductDetails = lazy(() => import('./Pages/Products/ProductDetails'))
const Products = lazy(() => import('./Pages/Products/Products'))
const CartDetails = lazy(() => import('./Pages/Cart/CartDetails'))
const Order = lazy(() => import('./Pages/Order/Order'))
const Orders = lazy(() => import('./Pages/Order/Orders'))
const OrderSuccess = lazy(() => import('./Pages/Order/OrderSuccess'))

function SplashScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <img src={Pizzalogo} alt="PizzaHub" className="w-14 h-14 object-contain" />
      <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
    </div>
  )
}

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authChecked } = useSelector((state) => state.auth)

  // Boot: restore the session from the httpOnly cookie (once) and ping the
  // backend so a cold Render instance wakes while the user looks at the splash.
  useEffect(() => {
    axiosInstance.get('/ping').catch(() => {})
    dispatch(verifyAuth())
  }, [dispatch])

  // Global auth events fired by the axios interceptor — ONE place that
  // handles expired sessions / forbidden access (no per-component toasts).
  useEffect(() => {
    function onSessionExpired() {
      dispatch(forceLogout())
      toast.error('Session expired. Please log in again.', { id: 'session-expired' })
      navigate('/auth/login', { replace: true })
    }
    function onForbidden() {
      toast.error('Admin access required', { id: 'forbidden' })
      navigate('/denied', { replace: true })
    }
    window.addEventListener('auth:session-expired', onSessionExpired)
    window.addEventListener('auth:forbidden', onForbidden)
    return () => {
      window.removeEventListener('auth:session-expired', onSessionExpired)
      window.removeEventListener('auth:forbidden', onForbidden)
    }
  }, [dispatch, navigate])

  // Never render routes/navbar until we know whether the cookie is valid.
  if (!authChecked) {
    return <SplashScreen />
  }

  return (
    <>
      <Suspense fallback={<SplashScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/denied" element={<Denied />} />

          <Route element={<RequireAuth />}>
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetails />} />
            <Route path="/cart" element={<CartDetails />} />
            <Route path="/order" element={<Order />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/success" element={<OrderSuccess />} />
          </Route>

          <Route element={<RequireAuth requiredRole="admin" />}>
            <Route path="/admin/addproduct" element={<Addproduct />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Exactly ONE toaster for the whole app */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          success: { duration: 2500 },
          error: { duration: 3500 },
        }}
      />
    </>
  )
}

export default App