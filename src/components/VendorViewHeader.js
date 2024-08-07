import React, { useState } from "react";
import { useLocation } from "react-router";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { db } from "../firebase/Firebase";
import { getDownloadURL, sorage } from "firebase/storage";
import { storage } from "../firebase/Firebase";
import { useRef, useEffect } from 'react';
import { collection, query, getDoc, updateDoc, doc } from "firebase/firestore";


function VendorViewHeader() {
  const daysOfWeek = [
    { day: "Mon", fullName: "Monday" },
    { day: "Tue", fullName: "Tuesday" },
    { day: "Wed", fullName: "Wednesday" },
    { day: "Thu", fullName: "Thursday" },
    { day: "Fri", fullName: "Friday" },
    { day: "Sat", fullName: "Saturday" },
    { day: "Sun", fullName: "Sunday" },
  ];
  const location = useLocation();
  const [profilePicture, setProfilePicture] = useState(
    useState(sessionStorage.getItem("pfp") && sessionStorage.getItem("pfp"))
  );
  const [chefsName, setChefsName] = useState(
    sessionStorage.getItem("name") && sessionStorage.getItem("name")
  );
  const [specialties, setSpecialties] = useState("");
  const [zipCode, setZipCode] = useState(
    sessionStorage.getItem("zipCode") && sessionStorage.getItem("zipCode")
  );
  const [bio, setBio] = useState(
    sessionStorage.getItem("aboutMe") && sessionStorage.getItem("aboutMe")
  );
  const [openHoursStart, setOpenHoursStart] = useState(
    sessionStorage.getItem("openTimeStart") &&
      sessionStorage.getItem("openTimeStart")
  );
  const [verificationStatus, setVerificationStatus] = useState('');

  const [openHoursEnd, setOpenHoursEnd] = useState(
    sessionStorage.getItem("openTimeEnd") &&
      sessionStorage.getItem("openTimeEnd")
  );
  const verifyStatus = sessionStorage.getItem("verify");
  const [selectedDays, setSelectedDays] = useState(
    sessionStorage.getItem("availability")!="undefined" ?
      JSON.parse(sessionStorage.getItem("availability")) : []
  );
  const [imageSource, setImageSource] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
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
  useEffect(() => {
    const verify = sessionStorage.getItem('verify');
    if (verify === '1') {
      setVerificationStatus('Verified!');
    } else if (verify === '0') {
      setVerificationStatus('Not Verified');
    }
  }, []);

  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };
  const infoBoxRef = useRef(null);
  const handleClickOutside = (event) => {
    if (infoBoxRef.current && !infoBoxRef.current.contains(event.target)) {
      setShowInfo(false);
    }
  };
  // Handler to toggle day selection
  const handleDayClick = (day) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };
  // Handlers for file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageSource(reader.result);
      };

      reader.readAsDataURL(file);
      setImageUpload(file);
    }
  };

  // Handlers for input changes
  const handleChefsNameChange = (e) => setChefsName(e.target.value);
  const handleZipCodeChange = (e) => setZipCode(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleOpenHoursStartChange = (e) => setOpenHoursStart(e.target.value);
  const handleOpenHoursEndChange = (e) => setOpenHoursEnd(e.target.value);
  
  const handleSaveChanges = async () => {
    try {
      const userEmail = sessionStorage.getItem("email");
      const userDocRef = doc(db, "users", userEmail);
  
      if (imageUpload == null) {
        // Update the user's profile information without an image
        await updateDoc(userDocRef, {
          name: chefsName,
          aboutMe: bio,
          zipCode: zipCode,
          availability: selectedDays,
          openHoursStart: openHoursStart,
          openHoursEnd: openHoursEnd,
        });
      } else {
        // Update the user's profile information with an image
        const imageName = imageUpload.name + v4();
        const imageRef = ref(storage, `images/${imageName}`);
        await uploadBytes(imageRef, imageUpload);
        const url = await getDownloadURL(imageRef);
  
        await updateDoc(userDocRef, {
          name: chefsName,
          profilePicture: url,
          aboutMe: bio,
          zipCode: zipCode,
          availability: selectedDays,
          openHoursStart: openHoursStart,
          openHoursEnd: openHoursEnd,
        });
      }
  
      // Update the items in the user's document
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userItems = userDocSnap.data().items || [];
        const updatedUserItems = userItems.map(item => ({
          ...item,
          endTime: openHoursEnd,
          startTime: openHoursStart,
          vendorDistance: zipCode, // Assuming vendorDistance is a state variable
          availability: selectedDays,
        }));
  
        await updateDoc(userDocRef, { items: updatedUserItems });
      }
  
      // Update the items in the menu_items_homepage collection
      const menuDocRef = doc(db, "menu_items_homepage", "menu");
      const menuDoc = await getDoc(menuDocRef);
      if (menuDoc.exists()) {
        const items = menuDoc.data().items;
        const updatedItems = items.map(item => {
          if (item.vendorId === userEmail) {
            return {
              ...item,
              endTime: openHoursEnd,
              startTime: openHoursStart,
              vendorDistance: zipCode, // Assuming vendorDistance is a state variable
              availability: selectedDays,
            };
          }
          return item;
        });
  
        await updateDoc(menuDocRef, { items: updatedItems });
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  
  
  return (
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
            backgroundImage: imageSource,
          }}
        >
          {!imageSource && profilePicture ? (
            <img
              style={{ borderRadius: "10px", objectFit: "cover" }}
              height={200}
              width={200}
              src={profilePicture}
            />
          ) : (
            <img
              style={{ borderRadius: "10px", objectFit: "cover" }}
              height={200}
              width={200}
              src={imageSource ? imageSource : "none"}
            />
          )}
        </div>
        <label
          style={{
            justifySelf: "center",
            marginTop: "10px",
            textAlign: "center",
            padding: "5px 0px",
            width: "200px",
          }}
          htmlFor="file-upload"
          className="custom-file-upload"
        >
          Upload Profile Picture
        </label>
        <input
          onChange={handleFileChange}
          id="file-upload"
          type="file"
          accept=".png,.jpg, .jpeg"
          style={{ display: "none" }} // Hide the default file input
        />
      
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
            <p>In order for a chef to be verified they must send a email to "homechef727@gmail.com", titled "Verification". The email should include Food Safety Certificaitons, Business Liscence, Kitchen Inspection Report, and any other information regarding credibility. </p>
          </div>
        )}
      </div>
    </div>
    <input
      type="text"
      disabled={true}
      value={verificationStatus}
      style={{
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        width: "100%",
        outline: "1px solid gainsboro",
        fontSize: "20px",
        fontFamily: "Poppins",
        color: verificationStatus === 'Verified!' ? 'green' : 'red',
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
            <br></br>
            <input
              type="text"
              disabled={true}
              value={chefsName}
              onChange={handleChefsNameChange}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                width: "400px",
                outline: "1px solid gainsboro",
                fontSize: "20px",
                fontFamily: "Poppins",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              padding: "0px 50px",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              padding: "20px 50px",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <label>Zip Code </label>
            <p style={{ fontSize: "12px", color: "gray" }}>
              Others can see your ZIP Code while browsing.
            </p>
            <input
              type="text"
              value={zipCode}
              onChange={handleZipCodeChange}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                width: "400px",
                outline: "1px solid gainsboro",
                fontSize: "20px",
                fontFamily: "Poppins",
              }}
            />
            <br></br>
            <label>Availability</label>
            <p style={{ fontSize: "12px", color: "gray" }}>
              List days of the week you're available to cook
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {daysOfWeek.map(({ day, fullName }) => (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    border: `2px solid ${
                      selectedDays?.includes(day) ? "green" : "gainsboro"
                    }`,
                    cursor: "pointer",
                    textAlign: "center",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: selectedDays.includes(day)
                      ? "#ebfcef"
                      : "white",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {day}
                  </span>
                </div>
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
            <p style={{ fontSize: "12px", color: "gray" }}>
              Write about your experience and passion for cooking
            </p>
            <textarea
              value={bio}
              onChange={handleBioChange}
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
            />
            <label>Open Hours </label>
            <p style={{ fontSize: "12px", color: "gray" }}>
              Open hours for your business
            </p>
            <div
              style={{
                display: "flex",
                width: "400px",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <input
                type="time"
                value={openHoursStart}
                onChange={handleOpenHoursStartChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "150px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              />{" "}
              <p>to</p>{" "}
              <input
                type="time"
                value={openHoursEnd}
                onChange={handleOpenHoursEndChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "150px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              />
            </div>

            <button
              onClick={async () => handleSaveChanges()}
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
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorViewHeader;
