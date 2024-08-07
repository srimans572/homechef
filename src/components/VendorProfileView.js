import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { getDownloadURL, storage } from "firebase/storage";
import { onSnapshot } from "firebase/firestore";
import Menu from "./Menu";
import { useRef } from 'react';


function VendorProfileView() {
  const location = useLocation();
  const vendorID = location.state?.vendorId;
  const [profilePicture, setProfilePicture] = useState();
  const [chefsName, setChefsName] = useState("John Doe");
  const [verification, setverification] = useState("John Doe");
  const [zipCode, setZipCode] = useState("12345");
  const [bio, setBio] = useState("I'm a chef");
  const [openHoursStart, setOpenHoursStart] = useState("9:00");
  const [openHoursEnd, setOpenHoursEnd] = useState("20:00");
  const [items, setItems] = useState([]);
  const [openDays, setOpenDays] = useState(["Mon", "Tuesday"]);
  const [showInfo, setShowInfo] = useState(false);
  
  useEffect(() => {
    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfo]);
  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };
  const infoBoxRef = useRef(null);
  const handleClickOutside = (event) => {
    if (infoBoxRef.current && !infoBoxRef.current.contains(event.target)) {
      setShowInfo(false);
    }
  };
  function convertTo12Hour(time24) {
    if (!time24) return "N/A";
  
    // Split the input time into hours and minutes
    const [hours24, minutes] = time24.split(":");
  
    // Handle cases where minutes might be undefined or not correctly split
    if (!hours24 || !minutes) return "N/A";
  
    // Convert string hours to a number
    let hours = parseInt(hours24);
  
    // Determine AM or PM suffix
    const period = hours >= 12 ? "PM" : "AM";
  
    // Convert hours from 24-hour format to 12-hour format
    hours = hours % 12 || 12; // Converts '0' hour to '12'
  
    // Ensure minutes is always two digits
    const formattedMinutes = minutes.padStart(2, '0');
  
    // Return the formatted string
    return `${hours}:${formattedMinutes} ${period}`;
  }
  

  useEffect(() => {
    if (vendorID) {
      const document_2 = onSnapshot(doc(db, "users", vendorID), (doc) => {
        try {
          setChefsName(doc.data().name || "John Doe");
          setverification(doc.data().verify || 0);
          setZipCode(doc.data().zipCode || "12345");
          setBio(doc.data().aboutMe || "I'm a chef");
          setProfilePicture(doc.data().profilePicture || undefined);
          setOpenHoursStart(doc.data().openHoursStart || "N/A");
          setOpenHoursEnd(doc.data().openHoursEnd || "N/A");
          setItems(doc.data().items || []);
          setOpenDays(doc.data().availability || ["information not provided"]);

          console.log(document_2);
        } catch (e) {
          console.log(e);
        }
      });
    }
  }, []);

  useEffect(() => {
    console.log("vendorID:", vendorID);
  }, [vendorID]);

  useEffect(() => {
    console.log(chefsName);
  }, [chefsName]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            padding: "20px 50px",
            flexDirection: "column",
            width: "fit-content",
          }}
        >
          <div
            style={{
              height: "200px",
              width: "200px",
              boxShadow: "0px 0px 16px 0px gainsboro",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex", flexDirection: "column" 
            }}
          >
            {profilePicture && (
              <img
                style={{ borderRadius: "10px", objectFit: "cover" }}
                height={200}
                width={200}
                src={profilePicture}
                alt="Profile"
              />
            )}
            
          </div>
          <div style={{ marginTop: "5%", flexDirection: "row", display: "flex", alignItems: "center" }}>
          <p>Verification Status</p>
          <div 
        onClick={handleToggleInfo} 
        style={{
          marginLeft: "10px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "bold" }}>?</span>
        {showInfo && (
          <div 
            ref={infoBoxRef}
            style={{
              position: "absolute",
              top: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "350px",
              padding: "10px",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              zIndex: 10
            }}
          >
            <p> Verification status shows wether the chef has complied to all food safety regulations, and provied them to HomeChef. </p>
          </div>
        )}
      </div>
          </div>
          <input
  type="text"
  disabled={true}
  value={verification === 1 ? "Verified" : "Not Verified"}
  style={{
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    width: "100%",
    outline: "1px solid gainsboro",
    fontSize: "20px",
    fontFamily: "Poppins",
    color: verification === 1 ? 'green' : 'red',
  }}
/>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                padding: "20px 50px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Chef's Name: </label>
              <br />
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "400px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              >
                <p style={{ margin: "0px" }}>{chefsName}</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 50px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Zip Code </label>
              <p style={{ fontSize: "12px", color: "gray" }}>
                This is where food can be picked up
              </p>
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "400px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              >
                <p style={{ margin: "0px" }}>{zipCode}</p>
              </div>
              <br />
              <label>Availability</label>
              <p style={{ fontSize: "12px", color: "gray" }}>
                The chef is available on these days
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {openDays.map((item, index) => (
                  <p
                    key={index}
                    style={{
                      padding: "10px 10px",
                      background: "whitesmoke",
                      borderRadius: "10px",
                      border: "1px solid gainsboro",
                    }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                padding: "20px 50px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Bio </label>
              <br />
              <div
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "500px",
                  height: "150px",
                  outline: "1px solid gainsboro",
                  fontSize: "16px",
                  fontFamily: "Poppins",
                  resize: "none",
                  marginBottom: "10px",
                }}
              >
                <p style={{ margin: "0px" }}>{bio}</p>
              </div>
              <label>Open Hours </label>
              <p style={{ fontSize: "12px", color: "gray" }}>
                The chef is open during these hours:
              </p>
              <div
                style={{
                  display: "flex",
                  width: "400px",
                  justifyContent: "space-between",
                  marginTop: "0px",
                }}
              >
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    width: "150px",
                    outline: "1px solid gainsboro",
                    fontSize: "20px",
                    fontFamily: "Poppins",
                  }}
                >
                  <p style={{ margin: "0px" }}>
                    {convertTo12Hour(openHoursStart)}
                  </p>
                </div>
                <p>to</p>
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "none",
                    width: "150px",
                    outline: "1px solid gainsboro",
                    fontSize: "20px",
                    fontFamily: "Poppins",
                  }}
                >
                  <p style={{ margin: "0px" }}>
                    {convertTo12Hour(openHoursEnd)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h4 style={{ margin: "50px" }}>Items By This Chef: </h4>
      <div
        style={{
          display: "flex",
          padding: "0px 0px",
          flexDirection: "column",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Menu items={items} location={"edit-chef-profile"} />{" "}
        </div>
      </div>
    </div>
  );
}

export default VendorProfileView;
