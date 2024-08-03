import React, { useState, useEffect } from "react";
import { storage } from "../firebase/Firebase";
import { useNavigate } from "react-router";
import { ref, getDownloadURL } from "firebase/storage";
import zipcodes from "zipcodes";
import { getDistance } from "geolib";
import { searchText } from "../global/global";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome

function Menu({ items, location }) {
  const [imageUrls, setImageUrls] = useState([{}]); // Store image URLs by item path
  const [cartItems, setCartItems] = useState(
    sessionStorage.getItem("cart")
      ? JSON.parse(sessionStorage.getItem("cart"))
      : []
  );
  const [isAdded, setIsAdded] = useState({}); // State for tracking added items
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddToCart = async (item) => {
    setCartItems([
      ...cartItems,
      {
        item: item,
        image: imageUrls[item.itemImage],
        quantity: 1,
      },
    ]);
    
    setIsAdded(prevState => ({
      ...prevState,
      [item.itemImage]: true,
    }));
    
    // Optionally reset isAdded after a delay
    setTimeout(() => {
      setIsAdded(prevState => ({
        ...prevState,
        [item.itemImage]: false,
      }));
    }, 2000);
  };

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateDistance = (vendorDistance) => {
    // Get latitude and longitude for both ZIP codes
    const loc1 = zipcodes.lookup(sessionStorage.getItem("zipCode"));
    const loc2 = zipcodes.lookup(vendorDistance);

    if (loc1 && loc2) {
      // Calculate the distance using geolib
      const distanceInMeters = getDistance(
        { latitude: loc1.latitude, longitude: loc1.longitude },
        { latitude: loc2.latitude, longitude: loc2.longitude }
      );

      // Convert meters to miles (1 mile = 1609.34 meters)
      const distanceInMiles = distanceInMeters / 1609.34;

      if (distanceInMiles < 5) {
        return "This item is within your area";
      } else {
        return (
          "Approximately " + distanceInMiles.toFixed(2) + " miles away from you"
        );
      }
    } else {
      return "Invalid ZIP code";
    }
  };

  const calculateDistanceForFilter = (vendorDistance, userDistance, radius) => {
    // Get latitude and longitude for both ZIP codes
    const loc1 = zipcodes.lookup(userDistance);
    const loc2 = zipcodes.lookup(vendorDistance);

    if (loc1 && loc2) {
      // Calculate the distance using geolib
      const distanceInMeters = getDistance(
        { latitude: loc1.latitude, longitude: loc1.longitude },
        { latitude: loc2.latitude, longitude: loc2.longitude }
      );

      // Convert meters to miles (1 mile = 1609.34 meters)
      const distanceInMiles = distanceInMeters / 1609.34;

      if (distanceInMiles < radius) {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }
  };

  const filterItemsByKeyword = (items, keyword, zipCode, radius) => {
    return items.filter((item) =>
      calculateDistanceForFilter(item.vendorDistance, zipCode, radius) &&
      Object.values(item).some(
        (value) =>
          typeof value === "string" && 
          value.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const openPopup = (item) => {
    setSelectedItem(item);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      {items &&
        filterItemsByKeyword(items, sessionStorage.getItem("searchText"), sessionStorage.getItem("zipCode"), sessionStorage.getItem("radius")).map(
          (item) => (
            <div
              key={item.itemImage}
              style={{
                padding: "10px 10px",
                backgroundColor: "white",
                boxShadow: "0px 0px 16px 1px gainsboro",
                width: "320px",
                height: "520px",
                borderRadius: "10px",
                margin: "20px 50px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <img
                  style={{
                    width: "320px",
                    height: "200px",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                  src={item.itemImage}
                  alt={item.itemName}
                />
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h1 style={{ margin: "0px", fontFamily: "Poppins" }}>
                    {item.itemName}
                  </h1>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p
                      style={{
                        margin: "0px",
                        fontFamily: "Lato",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={async () =>
                        navigate("/view-chef-profile", { state: { vendorId: item.vendorId } })
                      }
                    >
                      Chef {item.vendorName}
                    </p>
                    <p style={{ margin: "0px", fontFamily: "Lato" }}>
                      Cuisine:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {item.itemCuisine}
                      </span>
                    </p>
                  </div>

                  <p style={{ fontFamily: "Lato" }}>
                    <span style={{ fontWeight: "bold" }}>Description: </span>{" "}
                    {item.itemDescription}
                  </p>
                  <p style={{ fontFamily: "Lato" }}>
                    <span style={{ fontWeight: "bold" }}>Price: $</span>
                    {item.itemPrice}
                  </p>
                  {location !== "view" && (
                    <p style={{ fontFamily: "Lato" }}>
                      <i
                        className={"fas fa-location-dot"}
                        style={{ marginRight: "10px" }}
                      ></i>
                      {calculateDistance(item.vendorDistance)}
                    </p>
                  )}
                </div>
              </div>
              <div>
                {location === "view" && (
                  <button
                    style={{
                      fontFamily: "Poppins",
                      width: "100%",
                      borderRadius: "100px",
                      color: "white",
                      padding: "10px",
                      backgroundColor: "black",
                      justifySelf: "flex-end",
                    }}
                    onClick={async () =>
                      navigate("/add-item", { state: { item: item } })
                    }
                  >
                    Edit
                  </button>
                )}
                {location !== "view" && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                      style={{
                        fontFamily: "Poppins",
                        width: "49%",
                        borderRadius: "100px",
                        color: "white",
                        padding: "10px",
                        backgroundColor: "black",
                        justifySelf: "flex-end",
                        cursor: "pointer",
                        border: "none",
                      }}
                      onClick={() => openPopup(item)}
                    >
                      View More
                    </button>
                    <button
                      style={{
                        fontFamily: "Poppins",
                        width: "49%",
                        borderRadius: "100px",
                        color: "black",
                        padding: "10px",
                        backgroundColor: "white",
                        justifySelf: "flex-end",
                        border: "1px solid black",
                        cursor: "pointer",
                        position: 'relative',
                      }}
                      onClick={async () => handleAddToCart(item)}
                    >
                      {isAdded.hasOwnProperty(item.itemImage) ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div 
                            disabled={isAdded.hasOwnProperty(item.itemImage)}
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              borderRadius: '50%', 
                              backgroundColor: 'green', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              animation: 'fadeIn 0.5s'
                            }}
                          >
                            <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
                          </div>
                          <span style={{ marginLeft: '10px' }}>Added</span>
                        </div>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        )}

      {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "90%",
              height: "90%",
              backgroundColor: "white",
              display: "flex",
              borderRadius: "10px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              style={{
                width: "50%",
                objectFit: "cover",
              }}
              src={selectedItem?.itemImage}
              alt="Item"
            />
            <div style={{ padding: "20px", flex: 1 }}>
              <h2 style={{ margin: "0px", fontFamily: "Poppins", fontSize:"40px" }}>
                {selectedItem?.itemName}
              </h2>
              <p style={{ fontFamily: "Lato"}}>
                <span style={{ fontWeight: "bold" }}>Chef: </span>
                {selectedItem?.vendorName}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
                <div style={{
                  width: '30%',
                  borderRadius: '10px',
                  padding: '10px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  display: 'flex',
                  marginLeft:"20px",
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60px' // Adjust height as needed
                }}>
                  <p style={{ fontFamily: "Lato", fontWeight: 'bold', fontSize:"25px" }}>
                  {selectedItem?.itemPortion}
                  </p>
                </div>
                <div style={{
                  width: '30%',
                  borderRadius: '10px',
                  padding: '10px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  display: 'flex',
                  marginLeft:"20px",
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60px' // Adjust height as needed
                }}>
                <p style={{ fontFamily: "Lato", fontWeight: 'bold', fontSize:"25px"}}>
                ${selectedItem?.itemPrice}
                </p>
                </div>
                <div style={{
                  width: '30%',
                  borderRadius: '10px',
                  padding: '10px',
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  display: 'flex',
                  marginLeft:"20px",
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60px' // Adjust height as needed
                }}>
                  <p style={{ fontFamily: "Lato", fontWeight: 'bold', fontSize:"25px"}}>
                  {selectedItem?.itemCuisine}
                </p>
                  
                </div>
              </div>
              <p style={{ fontFamily: "Lato", marginTop:"40px" }}>
                <span style={{ fontWeight: "bold" }}>Tags: </span>{" "}
                {selectedItem?.itemTags}
              </p>
              <p style={{ fontFamily: "Lato", marginTop:"20px" }}>
                <span style={{ fontWeight: "bold" }}>Ingredients: </span>{" "}
                {selectedItem?.itemIngridients}
              </p>
              <p style={{ fontFamily: "Lato", marginTop:"40px", height:"220px"}}>
                <span style={{ fontWeight: "bold" }}>Description: </span>{" "}
                {selectedItem?.itemDescription}
              </p>
              <button
                      style={{
                        fontFamily: "Poppins",
                        width: "100%",
                        marginTop:"25px",
                        borderRadius: "100px",
                        color: "black",
                        padding: "10px",
                        backgroundColor: "black",
                        justifySelf: "flex-end",
                        border: "1px solid grey",
                        cursor: "pointer",
                        position: 'relative',
                      }}
                      onClick={async () => handleAddToCart(selectedItem)}
                    >
                      {isAdded.hasOwnProperty(selectedItem.itemImage) ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div 
                            disabled={isAdded.hasOwnProperty(selectedItem?.itemImage)}
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              borderRadius: '50%', 
                              backgroundColor: 'green', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              animation: 'fadeIn 0.5s'
                            }}
                          >
                            <span style={{ color: 'white', fontSize: '16px' }}>✓</span>
                          </div>
                          <span style={{ marginLeft: '10px' ,color:"white"}}>Added</span>
                        </div>
                      ) : (
                        <span style={{color:"white"}}>Add To Cart</span>
                      )}
                    </button>

            </div>
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                width:"40px",
                height:"40px",
                top: "10px",
                right: "10px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
