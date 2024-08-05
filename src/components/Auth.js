import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { db } from "../firebase/Firebase";
import { addDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthBox = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState(0);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
 
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const storeItems = async () => {
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);
    navigate("/create-account")
  }
  useEffect(() => {
    setError(false);
  }, [mode]);

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("email", email)
      console.log(user);
      navigate("/");
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };
  
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "30px 70px",
        width: "500px",
        height: "fit-content",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {error && (
        <div
          style={{
            height: "50px",
            width: "300px",
            backgroundColor: "tomato",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>
            Oops!
            {mode == 1
              ? " We can't find this account!"
              : " We encountered a problem."}
          </p>
        </div>
      )}
      <h2 style={{ fontFamily: "Poppins" }}>Welcome to HomeChef 👋</h2>
      <form onSubmit={handleSubmit}>
        {mode == 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "20px 0px",
              alignItems: "flex-start",
            }}
          >
            <label>Name</label>
            <input
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "10px",
                width: "100%",
                fontFamily: "Poppins",
                border: "none",
                outline: "1px solid gainsboro",
              }}
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px 0px",
            alignItems: "flex-start",
          }}
        >
          <label>Your email address</label>
          <input
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "10px",
              width: "100%",
              fontFamily: "Poppins",
              border: "none",
              outline: "1px solid gainsboro",
            }}
            type="email"
            placeholder="johndoe07@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "20px 0px",
            alignItems: "flex-start",
          }}
        >
          <label>Password</label>
          <input
            style={{
              marginTop: "10px",
              padding: "10px",
              borderRadius: "10px",
              width: "100%",
              fontFamily: "Poppins",
              border: "none",
              outline: "1px solid gainsboro",
            }}
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {mode == 1 ? (
          <button
          style={{
            fontFamily: "Poppins",
            width: "100%",
            borderRadius: "100px",
            color: "white",
            padding: "10px",
            backgroundColor: "black",
            justifySelf: "flex-end",
            marginTop: "30px",
            border: "none",
          }}
            type="submit"
            onClick={async () => login()}
          >
            Login
          </button>
        ) : (
          <div>
            <button
              style={{
                fontFamily: "Poppins",
                width: "100%",
                borderRadius: "100px",
                color: "white",
                padding: "10px",
                backgroundColor: "black",
                justifySelf: "flex-end",
                marginTop: "30px",
                border: "none",
              }}
              type="submit"
              onClick={async () => storeItems()}
            >
              Next
            </button>
          </div>
        )}
        <br></br>
        <hr></hr>
        {mode == 1 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "14px", margin: "30px 0px" }}>
              New to HomeChef?{" "}
            </p>
            <p
              style={{ fontSize: "14px", cursor: "pointer" }}
              onClick={async () => setMode(0)}
            >
              Sign Up
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "14px", margin: "30px 0px" }}>
              Have an account already?{" "}
            </p>
            <p
              style={{ fontSize: "14px", cursor: "pointer" }}
              onClick={async () => setMode(1)}
            >
              Sign In
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AuthBox;
