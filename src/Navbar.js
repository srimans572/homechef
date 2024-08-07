import React, { useState } from "react";
import "./styles/navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/Firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    signOut(auth);
    navigate("/")
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div
        className="nav-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }} // This adds a pointer cursor to indicate it's clickable
      >
        HomeChef
      </div>
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            backgroundColor: "black",
            padding: "10px 20px",
            borderRadius: "100px",
            width: "60px",
          }}
          onClick={async () => navigate("/cart")}
        >
          <i class="fa-solid fa-cart-shopping"></i>
          <p style={{ margin: "0px" }}>Cart</p>
        </div>
        <p
          className="dropdown-container"
          onClick={() => setIsHovered(!isHovered)}
          style={{
            background: "whitesmoke",
            cursor: "pointer",
            padding: "10px 15px",
            borderRadius: "10px",
            color: "black",
            boxShadow: "0px 0px 16px 1px gainsboro",
            fontWeight: "bold",
            margin: "0px",
            fontFamily: "Lato",
          }}
        >
          {sessionStorage.getItem("name") ? (
            sessionStorage.getItem("name").slice(0, 1)
          ) : (
            <i class="fa-solid fa-user"></i>
          )}
        </p>
        {isHovered &&
        sessionStorage.getItem("email") &&
        sessionStorage.getItem("userType") == "Chef" ? (
          <div
            style={{
              position: "Absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0px 0px 16px 1px gainsboro",
              width: "300px",
              right: "100px",
              top: "75px",
              height: "auto",
              borderRadius: "10px",
              zIndex: 999,
              backgroundColor: "white",
              padding: "10px 20px",
            }}
          >
            <p
              style={{
                border: "1px solid gainsboro",
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                fontFamily: "Poppins",
                cursor: "pointer",
                color: "black",
                margin: "0px",
              }}
              onClick={async () => {
                navigate("/edit-chef-profile");
              }}
            >
              My Profile
            </p>
            <p
              style={{
                border: "1px solid gainsboro",
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                fontFamily: "Poppins",
                cursor: "pointer",
                color: "black",
                marginTop: "10px",
              }}
              onClick={async () => {
                handleSignOut();
              }}
            >
              Log Out
            </p>
          </div>
        ) : isHovered && sessionStorage.getItem("email") ? (
          <div
            style={{
              position: "Absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0px 0px 16px 1px gainsboro",
              width: "300px",
              right: "100px",
              top: "75px",
              height: "auto",
              borderRadius: "10px",
              zIndex: 999,
              backgroundColor: "white",
              padding: "10px 20px",
            }}
          >
            <p
              style={{
                border: "1px solid gainsboro",
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                fontFamily: "Poppins",
                cursor: "pointer",
                color: "black",
                marginTop: "0px",
              }}
              onClick={async () => {
                handleSignOut();
              }}
            >
              Log Out
            </p>
          </div>
        ) : (
          isHovered &&
          !sessionStorage.getItem("email") && (
            <div
              style={{
                position: "Absolute",
                display: "flex",
                alignItems: "center",
                boxShadow: "0px 0px 16px 1px gainsboro",
                width: "300px",
                right: "100px",
                top: "75px",
                height: "auto",
                borderRadius: "10px",
                zIndex: 999,
                backgroundColor: "white",
                padding: "10px",
              }}
            >
              <p
                style={{
                  border: "1px solid gainsboro",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  fontFamily: "Poppins",
                  cursor: "pointer",
                  color: "black",
                }}
                onClick={async () => {
                  navigate("/auth");
                }}
              >
                Log In
              </p>
            </div>
          )
        )}
      </div>
      <div className="nav-toggle" onClick={toggleNavbar}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};
export default Navbar;
