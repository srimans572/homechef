import Navbar from "../Navbar";
import { Route, Router, Routes } from "react-router-dom";
import Menu from "../components/Menu";
import VendorViewHeader from "../components/VendorViewHeader";
import { useState } from "react";
import VendorProfileView from "../components/VendorProfileView";

function Profile() {
  return (
    <div className="App">
      <Navbar />
      <VendorProfileView />
    </div>
  );
}

export default Profile;