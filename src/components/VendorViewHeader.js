import React, { useState } from "react";
import { useLocation } from "react-router";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { getDownloadURL, sorage } from "firebase/storage";
import { storage } from "../firebase/Firebase";

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
  const [profilePicture, setProfilePicture] = useState(useState(sessionStorage.getItem("pfp") && sessionStorage.getItem("pfp")));;
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
  const [openHoursStart, setOpenHoursStart] = useState(sessionStorage.getItem("openTimeStart") && sessionStorage.getItem("openTimeStart"));
  const [openHoursEnd, setOpenHoursEnd] = useState(sessionStorage.getItem("openTimeEnd") && sessionStorage.getItem("openTimeEnd"));
  const [selectedDays, setSelectedDays] =useState(sessionStorage.getItem("availability") && sessionStorage.getItem("availability"));
  const [imageSource, setImageSource] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

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

  function convertToInputTimeFormat(timeString) {
    // Ensure hours and minutes are always two digits
   if (timeString.length === 4) {
        // Extract hours and minutes from the input string
        const hours = `0${timeString.charAt(0)}`;
        const minutes = timeString.slice(1, 3);
        return `${hours}:${minutes}`;
    } else if (timeString.length === 5) {
        // Extract hours and minutes from the input string
        const hours = timeString.slice(0, 2);
        const minutes = timeString.slice(2, 4);
        return `${hours}:${minutes}`;
    } else {
        // Handle invalid input
        return "Invalid time string";
    }
}
  const handleSaveChanges = async () => {
    
    try {
      if (imageUpload == null) return;
      const imageName = imageUpload.name + v4();
      const imageRef = ref(storage, `images/${imageName}`);
      uploadBytes(imageRef, imageUpload).then(async()=>{
        const url = await getDownloadURL(imageRef)
      await updateDoc(doc(db, "users", sessionStorage.getItem("email")), {
        name:chefsName,
        profilePicture:url,
        aboutMe:bio,
        zipCode:zipCode,
        availability: JSON.stringify(selectedDays),
        openHoursStart:openHoursStart,
        openHoursEnd:openHoursEnd
      });
      })
      
    }
      catch(e){
        console.log(e)
      }

    }
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
              {(!imageSource && profilePicture) ? <img
              style={{borderRadius:"10px", objectFit:"cover"}}
                height={200}
                width={200}
                src={
                 profilePicture
                }
              /> : <img
              style={{borderRadius:"10px", objectFit:"cover"}}
                height={200}
                width={200}
                src={
                 imageSource
                }
              />}
            </div>
            <label style={{justifySelf:"center", marginTop:"10px", textAlign:"center",  padding:"5px 0px", width:"200px"}} htmlFor="file-upload" className="custom-file-upload">
              Upload Profile Picture
            </label>
            <input
              onChange={handleFileChange}
              id="file-upload"
              type="file"
              accept=".png,.jpg, .jpeg"
              style={{ display: "none" }} // Hide the default file input
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
                      selectedDays.includes(day) ? "green" : "gainsboro"
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
              onClick={handleSaveChanges}
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
