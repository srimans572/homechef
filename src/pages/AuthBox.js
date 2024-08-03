import Navbar from "../Navbar";
import { Route, Router, Routes } from "react-router-dom";

import AuthBox from "../components/Auth";
function AuthPage() {
  return (
    <div className="App" style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh"}}>
      <AuthBox/>
    </div>
  );
}

export default AuthPage;
