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

const FillUp = () => {
  const [zipCode, setZipCode] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [telegramID, setTelegramID] = useState("");
  const [accountType, setAccountType] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState(0);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        sessionStorage.getItem("email"),
        sessionStorage.getItem("password")
      );
      console.log(user);

      await setDoc(doc(db, "users", sessionStorage.getItem("email")), {
        name: sessionStorage.getItem("name"),
        email: sessionStorage.getItem("email"),
        userType: accountType,
        zipCode: zipCode,
        aboutMe: aboutMe,
        telegramID: telegramID,
        phoneNumber: phone,
        items:null
      });
      console.log(document);
      sessionStorage.removeItem("password");
      sessionStorage.setItem("zipCode", zipCode)
      navigate("/");
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  useEffect(() => {
    console.log(accountType);
  }, [accountType]);

  const logOut = async () => {
    await signOut(auth);
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
            width: "350px",
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
      <h2 style={{ fontFamily: "Poppins", width: "450px" }}>
        Let's Complete Your Account Set Up
      </h2>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "20px 0px",
                alignItems: "flex-start",
              }}
            >
              <label>Account Type</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "350px",
                  paddingTop: "20px",
                }}
              >
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    width: "50%",
                    fontFamily: "Poppins",
                    border: "none",
                    outline:
                      accountType == "Buyer"
                        ? "1px solid green"
                        : "1px solid gainsboro",
                    background:
                      accountType == "Buyer" ? "#ebfcef" : "transparent",
                    cursor: "pointer",
                    margin: "0px 10px 0px 0px",
                    textAlign: "center",
                  }}
                  onClick={async () => setAccountType("Buyer")}
                >
                  Buyer
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    width: "50%",
                    fontFamily: "Poppins",
                    border: "none",
                    margin: "0px 10px 0px 0px",
                    outline:
                      accountType == "Chef"
                        ? "1px solid green"
                        : "1px solid gainsboro",
                    background:
                      accountType == "Chef" ? "#ebfcef" : "transparent",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={async () => setAccountType("Chef")}
                >
                  Home Chef
                </div>
              </div>
            </div>
            <label>Phone Number</label>
            <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
              Enter your phone number
            </p>
            <input
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "10px",
                width: "95%",
                fontFamily: "Poppins",
                border: "none",
                outline: "1px solid gainsboro",
              }}
              type="text"
              placeholder="8888888888"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <br></br>
            <label>Zip Code</label>
            <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
              Enter your Zip Code associated with your location.
            </p>
            <input
              style={{
                marginTop: "10px",
                padding: "10px",
                borderRadius: "10px",
                width: "95%",
                fontFamily: "Poppins",
                border: "none",
                outline: "1px solid gainsboro",
              }}
              type="number"
              placeholder="12345"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
            <br></br>
            <label>Telegram Chat ID</label>
                <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                  Search @chatIDrobot on Telegram to find your unique Telegram Chat ID
                </p>
                <input
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    width: "475px",
                    fontFamily: "Poppins",
                    border: "none",
                    outline: "1px solid gainsboro",
                    resize: "none",
                  }}
                  type="text"
                  placeholder="0123456789"
                  value={telegramID}
                  onChange={(e) => setTelegramID(e.target.value)}
                />
            {accountType == "Chef" && (
              <div style={{}}>
                <br></br>
                <label>About Me</label>
                <p style={{ margin: 0, fontSize: "12px", color: "gray" }}>
                  This information will be available for others to see
                </p>
                <textarea
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "10px",
                    width: "475px",
                    fontFamily: "Poppins",
                    border: "none",
                    outline: "1px solid gainsboro",
                    resize: "none",
                  }}
                  type="text"
                  placeholder="I'm a chef..."
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
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
            cursor:"pointer"
          }}
          type="submit"
          onClick={async () => register()}
        >
          Finish Sign Up
        </button>
      </form>
    </div>
  );
};

export default FillUp;