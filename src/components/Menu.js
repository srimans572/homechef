import React, { useState, useEffect } from "react";
import { storage } from "../firebase/Firebase";
import { useNavigate } from "react-router";
import { ref, getDownloadURL } from "firebase/storage";
import zipcodes from "zipcodes";
import { getDistance } from "geolib";
import { searchText } from "../global/global";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import { updateDoc, arrayRemove, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { getDoc } from "firebase/firestore";



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
  const handleRemoveItem = async (item) => {
    try {
      // Remove the item from the user's list in Firebase
      await updateDoc(doc(db, "users", sessionStorage.getItem("email")), {
        items: arrayRemove(item),
      });

      // Remove the item from the homepage menu in Firebase
      await updateDoc(doc(db, "menu_items_homepage", "menu"), {
        items: arrayRemove(item),
      });

      // Optionally, you can update the local state or reload the items
      const updatedItems = items.filter(i => i.itemImage !== item.itemImage);
      setCartItems(updatedItems);
      sessionStorage.setItem("items", JSON.stringify(updatedItems));

      // Provide feedback or navigate as needed
      window.location.reload()
    } catch (error) {
      console.error("Error removing item: ", error);
    }
  };
  const handleAddToCart = async (item) => {
  try {
    // Update local state
    setCartItems((prevItems) => [
      ...prevItems,
      {
        item: item,
        quantity: 1,
      },
    ]);

    setIsAdded((prevState) => ({
      ...prevState,
      [item.itemImage]: true,
    }));

    // Get the current user's email from sessionStorage
    const userEmail = sessionStorage.getItem("email");
    if (userEmail) {
      // Reference to the user's document in Firestore
      const userDocRef = doc(db, "users", userEmail);

      // Fetch the current user's document
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        // Get the existing cart items from the user's document
        const userCart = userDoc.data().cart || [];

        // Add the new item to the cart
        const updatedCart = [
          ...userCart,
          {
            item: item,
            quantity: 1,
          },
        ];

        // Update the user's document with the new cart
        await updateDoc(userDocRef, {
          cart: updatedCart,
        });
      } else {
        console.log("User document does not exist.");
      }
    } else {
      console.log("User email is not available in sessionStorage.");
    }
  } catch (error) {
    console.error("Error adding item to cart: ", error);
  }
};

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateDistance = (vendorDistance) => {
    // Get latitude and longitude for both ZIP codes
    const loc1 = zipcodes.lookup(sessionStorage.getItem("cartZipCode"));
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
      if (sessionStorage.getItem("zipCode")) {
        return "Invalid Zip Code";
      } else {
        return "Enter you Zip Code";
      }
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
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const filterItemsByKeyword = (items, keyword, zipCode, radius) => {
    if (sessionStorage.getItem("cartZipCode")) {
      return items.filter(
        (item) =>
          calculateDistanceForFilter(item.vendorDistance, zipCode, radius) &&
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(keyword.toLowerCase())
          )
      );
    } else {
      return items.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
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
        filterItemsByKeyword(
          items,
          sessionStorage.getItem("searchText"),
          location !== "view" 
            ? sessionStorage.getItem("cartZipCode") 
            : sessionStorage.getItem("zipCode"),
          sessionStorage.getItem("radius")
        ).map((item) => (
          <div
            key={item.itemImage}
            style={{
              padding: "10px 10px",
              backgroundColor: "white",
              boxShadow: "0px 0px 16px 1px gainsboro",
              width: "320px",
              height: "550px",
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
                src={item.itemImage} // Fallback image
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
                      cursor: "pointer",
                    }}
                    onClick={async () =>
                      navigate("/view-chef-profile", {
                        state: { vendorId: item.vendorId },
                      })
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

                <p style={{ fontFamily: "Lato", }}>
                  <span style={{ fontWeight: "bold" }}>Description: </span>{" "}
                  {item.itemDescription.slice(0,100)}...
                </p>
                <p style={{ fontFamily: "Lato" }}>
                  <span style={{ fontWeight: "bold" }}>Price: $</span>
                  {item.itemPrice}
                </p>
                {location != "view" && (
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
              {location == "view" && (
                <div>
                <button
                  style={{
                    fontFamily: "Poppins",
                    width: "47.5%",
                    marginLeft:"0%",
                    borderColor:"red",
                    borderRadius: "100px",
                    color: "white",
                    padding: "10px",
                    backgroundColor: "red",
                    justifySelf: "flex-end",
                  }}
                  onClick={() => handleRemoveItem(item)}
                >
                  Remove
                </button>
                <button
                  style={{
                    marginLeft:"0%",
                    fontFamily: "Poppins",
                    marginLeft:"5%",
                    width: "47.5%",
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
                </div>
              )}
              {location != "view" && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {" "}
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
    cursor: isAdded.hasOwnProperty(item.itemImage) ? "not-allowed" : "pointer", // Change cursor when disabled
    position: "relative",
  }}
  onClick={
    isAdded.hasOwnProperty(item.itemImage)
      ? () => {} // No-op function
      : async () => handleAddToCart(item) // Actual function
  }
>
  {isAdded.hasOwnProperty(item.itemImage) ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "green",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.5s",
        }}
      >
        <span style={{ color: "white", fontSize: "16px" }}>✓</span>
      </div>
      <span style={{ marginLeft: "10px" }}>Added</span>
    </div>
  ) : (
    "Add to Cart"
  )}
</button>

                </div>
              )}
            </div>
          </div>
        ))}
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
              <h2
                style={{
                  margin: "0px",
                  fontFamily: "Poppins",
                  fontSize: "40px",
                }}
              >
                {selectedItem?.itemName}
              </h2>
              <p style={{ fontFamily: "Lato", fontSize:"20px" }}>
                <span style={{ fontWeight: "bold" }}>Chef: </span>
                {selectedItem?.vendorName}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "50px",
                }}
              >
                <div
                  style={{
                    position: "relative", // Enable absolute positioning inside
                    width: "30%",
                    borderRadius: "10px",
                    padding: "10px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    display: "flex",
                    marginLeft: "20px",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60px", // Adjust height as needed
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "10px",
                      fontSize: "12px",
                      color: "gray",
                    }}
                  >
                    Portion
                  </span>
                  <p
                    style={{
                      fontFamily: "Lato",
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    {selectedItem?.itemPortion}
                  </p>
                </div>
                <div
                  style={{
                    position: "relative", // Enable absolute positioning inside
                    width: "30%",
                    borderRadius: "10px",
                    padding: "10px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    display: "flex",
                    marginLeft: "20px",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60px", // Adjust height as needed
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "10px",
                      fontSize: "12px",
                      color: "gray",
                    }}
                  >
                    Price
                  </span>
                  <p
                    style={{
                      fontFamily: "Lato",
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    ${selectedItem?.itemPrice}
                  </p>
                </div>
                <div
                  style={{
                    position: "relative", // Enable absolute positioning inside
                    width: "30%",
                    borderRadius: "10px",
                    padding: "10px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    display: "flex",
                    marginLeft: "20px",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60px", // Adjust height as needed
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "5px",
                      left: "10px",
                      fontSize: "12px",
                      color: "gray",
                    }}
                  >
                    Cuisine
                  </span>
                  <p
                    style={{
                      fontFamily: "Lato",
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    {selectedItem?.itemCuisine}
                  </p>
                </div>
              </div>

              <p style={{ fontFamily: "Lato", marginTop: "40px" }}>
                <span style={{ fontWeight: "bold" }}>Tags: </span>{" "}
                {selectedItem?.itemTags}
              </p>
              <p style={{ fontFamily: "Lato", marginTop: "20px" }}>
                <span style={{ fontWeight: "bold" }}>Ingredients: </span>{" "}
                {selectedItem?.itemIngridients}
              </p>
              <p
                style={{
                  fontFamily: "Lato",
                  marginTop: "40px",
                  height:"22%"
                }}
              >
                <span style={{ fontWeight: "bold" }}>Description: </span>{" "}
                {selectedItem?.itemDescription}
              </p>
              <button
                style={{
                  fontFamily: "Poppins",
                  width: "100%",
                  borderRadius: "100px",
                  color: "black",
                  padding: "10px",
                  backgroundColor: "black",
                  justifySelf: "flex-end",
                  alignSelf:"flex-end",
                  border: "1px solid grey",
                  cursor: "pointer",
                  position: "relative",
                  top:100
                }}
                onClick={async () => handleAddToCart(selectedItem)}
              >
                {isAdded.hasOwnProperty(selectedItem.itemImage) ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      disabled={isAdded.hasOwnProperty(selectedItem?.itemImage)}
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "green",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        animation: "fadeIn 0.5s",
                      }}
                    >
                      <span style={{ color: "white", fontSize: "16px" }}>
                        ✓
                      </span>
                    </div>
                    <span style={{ marginLeft: "10px", color: "white" }}>
                      Added
                    </span>
                  </div>
                ) : (
                  <span style={{ color: "white" }}>Add To Cart</span>
                )}
              </button>
            </div>
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                width: "40px",
                height: "40px",
                top: "10px",
                right: "10px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                fontFamily:"Poppins",
                fontWeight:"bold"
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;
