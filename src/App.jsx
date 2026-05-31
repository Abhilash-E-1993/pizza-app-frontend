import {Route,Routes} from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Signup from './Pages/Auth/Signup'

import NotFound from './Pages/NotFound'
import Denied from './Pages/Denied'
import Addproduct from './Pages/Admin/Addproduct'
import Login from './Pages/Auth/Login'
import ProductDetails from './Pages/Products/ProductDetails'
import Products from './Pages/Products/Products'
import CartDetails from './Pages/Cart/CartDetails'
import Order from './Pages/Order/Order'
import OrderSuccess from './Pages/Order/OrderSuccess'
import RequireAuth from './Components/Auth/RequireAuth'


function App() {
 

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signup" element={< Signup/>} />
        <Route path="/auth/login" element={< Login/>}/>
        <Route path="/denied" element={<Denied />}/>

        <Route element={<RequireAuth/>}>
          <Route path='/cart' element={<CartDetails/>}/>
          <Route path='/order' element={<Order/>}/>
          <Route path='/order/success' element={<OrderSuccess/>}/>
        </Route>

        <Route element={<RequireAuth requiredRole="admin" />}>
          <Route path="/admin/addproduct" element={<Addproduct/>}/>
        </Route>

        <Route path='/products' element={<Products/>}/>
        <Route path='/products/:productId' element={<ProductDetails/>}/>
        

        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </>
  )
}

export default App
