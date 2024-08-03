import Navbar from "../Navbar";
import { Route, Router, Routes } from "react-router-dom";
import Menu from "../components/Menu";
import VendorViewHeader from "../components/VendorViewHeader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VendorView() {
  const [items, setItems] = useState((sessionStorage.getItem("items")!=undefined) && JSON.parse(sessionStorage.getItem("items")))
  const navigate = useNavigate();
  return (
    <div className="App">
      <Navbar />
      <VendorViewHeader />
      <h4 style={{margin:"50px"}}>My Items: </h4>
      <div
        style={{
          display: "flex",
          padding: "0px 50px",
          flexDirection: "column",
          alignItems: "flex-start",
          flexDirection:"row"
        }}
      >
       
        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
        </div>
        <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
        <div
          style={{
            padding: "10px 10px",
            backgroundColor: "white",
            boxShadow: "0px 0px 16px 1px gainsboro",
            width: "320px",
            height: "520px",
            borderRadius: "10px",
            // margin: "20px 50px",
            marginTop:"20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontFamily:"Poppins"
          }}
        >
         <button
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            cursor: "pointer",
            fontFamily:"Poppins",
            marginBottom: "0px", // Space between the button and the text
          }}
          onClick={() => navigate("/add-item")} // Navigate to /add-item route
        >
          +
        </button>
        <p style={{ fontFamily: "Poppins", color: "black", fontSize: "25px" }}>Add Item</p>
        </div>

         <Menu items={items} location={"view"} />
         </div>
     
      </div>
    </div>
  );
}

export default VendorView;
