import Navbar from "../Navbar";
import { Route, Router, Routes } from "react-router-dom";

import AuthBox from "../components/Auth";
import FillUp from "../components/InfoFillUp";
function AccountDetailsSignUp() {
  return (
    <div className="App" style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh"}}>
     <FillUp></FillUp>
    </div>
  );
}

export default AccountDetailsSignUp;
