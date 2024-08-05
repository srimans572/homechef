import React, { useEffect } from "react";
import { useState } from "react";

function Search() {
  const [searchText, setSearchText] = useState(sessionStorage.getItem("searchText")?sessionStorage.getItem("searchText"):"");
  const [zipCode, setZipcode] = useState((!sessionStorage.getItem("cartZipCode")&&sessionStorage.getItem("zipCode"))?sessionStorage.getItem("zipCode"):sessionStorage.getItem("cartZipCode")?sessionStorage.getItem("cartZipCode"):"");
  const [radius, setRadius] =  useState(sessionStorage.getItem("radius")?sessionStorage.getItem("radius"):"10");

  useEffect(()=>{
    sessionStorage.setItem("cartZipCode", zipCode)
    sessionStorage.setItem("searchText", searchText)
    sessionStorage.setItem("radius",radius)
  }
  ,[zipCode, searchText, radius])
  
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontFamily: "Poppins",
          marginTop: "50px",
          textShadow: "2px 2px px gray"  
        }}
      >
      Discover Authentic Cuisines By Home Cooks.
      </h1>
      <div style={styles.searchContainer}>
        <div
          style={{
            display: "flex",
            alignItems: "start",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0px 40px 0px 0px",
          }}
        >
          <p style={{ margin: "0px", fontFamily: "Poppins", fontSize:"12px", color:"gray" }}>Search</p>
          <input
            type="text"
            placeholder="Search for food, chefs, cuisines, etc..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{width:"330px",fontSize: "16px", border:"none", outline:"none", fontFamily:"Lato"}}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              justifyContent: "center",
              borderLeft: "1px solid gainsboro",
              padding: "0px 40px 0px 20px",
            }}
          >
            <p  style={{ margin: "0px", fontFamily: "Poppins", fontSize:"12px", color:"gray" }} >Zip Code</p>
            <input
              type="number"
              placeholder="12345"
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              style={styles.input}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              justifyContent: "center",
              borderLeft: "1px solid gainsboro",
              padding: "0px 40px 0px 20px",
            }}
          >
            <p  style={{ margin: "0px", fontFamily: "Poppins", fontSize:"12px", color:"gray" }}>Radius</p>
            <div style={{ display: "flex", alignItems:"center", justifyContent:"space-between" }}>
              <select
                type="text"
                placeholder="5"
                value={radius}
                style={styles.input}
                onChange={async(e)=>setRadius(e.target.value)}
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <p style={{margin:"0px"}}> miles</p>
            </div>
            
           
          </div>
          <button
              style={{
                fontFamily: "Poppins",
                width: "50px",
                borderRadius: "100px",
                color: "white",
                padding: "10px",
                backgroundColor: "black",
                justifySelf: "flex-end",
                border:"none",
                padding:"0px 0px"
              }}
            onClick={async()=>{window.location.reload()}}
            >
             <i class="fas fa-search"></i>
            </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "100px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    padding: "10px 40px",
    width: "100%",
    maxWidth: "800px",
    margin: "50px auto",
    height: "70px",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "5px 0",
    fontSize: "16px",
    backgroundColor: "transparent",
    width: "fit-content",
    fontFamily: "Lato",
  },
  button: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "12px",
  },
  icon: {
    width: "24px",
    height: "24px",
    color: "#FF5A5F",
  },
};

export default Search;
