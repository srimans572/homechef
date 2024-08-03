import Navbar from "./Navbar";
import {Route, Routes} from "react-router-dom";
import VendorView from "./pages/VendorView";
import Home from "./pages/Home";
import AddItem from "./pages/AddItem";
import AuthPage from "./pages/AuthBox";
import AccountDetailsSignUp from "./pages/AccountDetailsSignUp";
import Cart from "./pages/Cart";
import Profile from "./pages/profile"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/edit-chef-profile" element={<VendorView></VendorView>}></Route>
        <Route path="/add-item" element={<AddItem></AddItem>}/>
        <Route path="/auth" element={<AuthPage></AuthPage>}/>
        <Route path="/view-chef-profile" element={<Profile></Profile>}/>
        <Route path="create-account" element={<AccountDetailsSignUp/>}></Route>
        <Route path="cart" element={<Cart/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
