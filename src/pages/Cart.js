import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { Resend } from "resend";

const resend = new Resend("re_M1CS65eK_CniJtZ8GpxDWT91YCfCy5DQG");

function Cart() {
  const [items, setItems] = useState(
    JSON.parse(sessionStorage.getItem("cart"))
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderContent, setOrderContent] = useState();
  const [additionalNotes, setAdditionalNotes] = useState("N/A");
  const [clicked, setClick] = useState(false);

  const createOrderDetails = async () => {
    setClick(true);
    const groupedOrders = items.reduce((acc, entry) => {
      const vendorId = entry.item.vendorId;
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorTelegramId: entry.item.vendorTelegramId, // Assuming same vendor ID for all items
          orderDetails: [],
          buyerContact: sessionStorage.getItem("phoneNumber"), // Assuming same contact for all items
          buyerName: sessionStorage.getItem("name"), // Assuming same name for all items
          buyerEmail: sessionStorage.getItem("email"),
          additionalNotes: additionalNotes,
        };
      }

      // Push the item details into the orderDetails array
      acc[vendorId].orderDetails.push({
        itemName: entry.item.itemName,
        itemPrice: `$${entry.item.itemPrice}`, // Adding $ sign for consistency
        itemQuantity: entry.quantity,
        totalPrice: parseFloat(entry.quantity * entry.item.itemPrice),
      });
      setItems([]);

      return acc;
    }, {});

    // Step 2: Transform grouped data into an array
    const content = Object.values(groupedOrders);
    setOrderContent(content);
    console.log(content);
  };

  useEffect(() => {
    const placeOrder = async () => {
      const options = {
        method: "POST",
        headers: {
          Accept: "*",
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details: orderContent,
        }),
      };
      try {
        const response = await fetch(
          "https://ym78ei5nk1.execute-api.us-west-2.amazonaws.com/prod/",
          options
        );
        console.log("Response status:", response.status); // Log response status
        console.log("Response headers:", response.headers);
      } catch (e) {
        console.log(e);
      }
    };

    if (orderContent) {
      placeOrder();
    }
  }, [orderContent]);

  const handleIncrease = (index) => {
    const updatedItems = items.map((item, idx) => {
      if (idx === index) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setItems(updatedItems);
  };
  const handleRemove = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
  };
  const handleDecrease = (index) => {
    const updatedItems = items.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,

          quantity: item.quantity > 1 ? item.quantity - 1 : 1,
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const calculatePrice = (item) => {
    var price = 0;
    for (let i = 0; i < item.length; i++) {
      const entry = item[i];
      console.log(entry);
      var num =
        Math.round(parseFloat(entry.item.itemPrice * entry.quantity * 1000)) /
        1000;
      price = price + num;
      console.log(price);
    }
    setTotalPrice(price);
  };

  useEffect(() => {
    calculatePrice(items);
  }, [items]);

  const inputStyle = {
    width: "60px",
    textAlign: "center",
    margin: "0 10px",
    padding: "5px",
    fontSize: "16px",
  };

  const buttonStyle = {
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "400px",
    padding: "5px 10px",
    fontSize: "16px",
    cursor: "pointer",
    margin: "0 5px",
    width: "30px",
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div className="App">
      <Navbar />
      <div>
        <div
          style={{
            padding: "50px 100px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "20px",
                borderBottom: "1px solid gainsboro",
                marginBottom: "30px",
                width: "800px",
              }}
            >
              <p style={{ fontFamily: "Poppins" }}>Your Cart</p>
              <p
                style={{
                  textAlign: "end",
                  fontFamily: "Poppins",
                }}
              >
                {items.length} Item(s)
              </p>
            </div>
            {(items.length<1||items==null||items==undefined)&&<div
                style={{
                  height: "150px",
                  width: "800px",
                  boxShadow: "0px 0px 16px 1px gainsboro",
                  borderRadius: "10px",
                  padding: "10px",
                  display: "flex",
                  alignItems:"center",
                  justifyContent: "center",
                  flexDirection: "row",
                  marginTop: "10px",
                }}
              >
                Nothing to see here
                </div>}
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  height: "150px",
                  width: "800px",
                  boxShadow: "0px 0px 16px 1px gainsboro",
                  borderRadius: "10px",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  marginTop: "10px",
                }}
              >
                <div style={{ display: "flex", width: "500px" }}>
                  <img
                    style={{ borderRadius: "10px", height: "150px" }}
                    src={item.item.itemImage}
                    alt={item.item.itemName}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "10px",
                    }}
                  >
                    <h1 style={{ margin: "0px", fontFamily: "Poppins" }}>
                      {item.item.itemName}
                    </h1>
                    <p style={{ margin: "0px", fontFamily: "Poppins" }}>
                      {item.item.vendorName}
                    </p>
                    <h3 style={{ margin: "50px 0px", fontFamily: "Poppins" }}>
                      $ {item.item.itemPrice}
                    </h3>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "transparent",
                      color: "black",
                      border: "none",
                      textDecoration: "underline",
                      cursor: "pointer",
                      marginBottom: "40px",
                      marginLeft: "100px",
                    }}
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                  <p style={{ fontFamily: "Lato" }}>Quantity</p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      style={buttonStyle}
                      onClick={() => handleDecrease(index)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      style={inputStyle}
                    />
                    <button
                      style={buttonStyle}
                      onClick={() => handleIncrease(index)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              width: "320px",
              height: "75vh",
              boxShadow: "0px 0px 16px 1px gainsboro",
              borderRadius: "10px",
              padding: "10px 30px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontFamily: "Lato", fontSize: "24px" }}>
                Order Total
              </p>
              <h2
                style={{
                  fontFamily: "Poppins",
                  padding: "10px 20px",
                  border: "1px solid gainsboro",
                  borderRadius: "10px",
                  fontWeight: "normal",
                }}
              >
                ${totalPrice}
              </h2>
              <label>Additional Notes </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                Leave a note to your order
              </p>
              <br />
              <textarea
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "300px",
                  outline: "1px solid gainsboro",
                  fontSize: "14px",
                  fontFamily: "Poppins",
                  height: "100px",
                  resize: "none",
                }}
                placeholder={"N/A"}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                value={additionalNotes}
              ></textarea>
              <br></br>
              <br></br>

              <label style={{ marginTop: "10px" }}>Date & Time</label>
              <p style={{ fontSize: "12px", color: "gray" }}>
                Select a pick up date and time.
              </p>
              <input
                style={{
                  display: "inline-block",
                  padding: "10px",
                  border: "1px solid gainsboro",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontFamily: "Poppins, sans-serif",
                  // marginRight: "10px",
                  width: "40%",
                  marginRight: "20px",
                }}
                type="date"
              />
              <input
                type="time"
                style={{
                  padding: "10px",
                  // marginLeft:"2px",
                  border: "1px solid gainsboro",
                  borderRadius: "5px",
                  outline: "none",
                  fontFamily: "Poppins, sans-serif",
                  width: "40%",
                }}
              />
            </div>

            {!clicked && items.length > 0 ? (
              <button
                style={{
                  fontFamily: "Poppins",
                  width: "100%",
                  borderRadius: "100px",
                  color: "white",
                  padding: "10px",
                  backgroundColor: "black",
                  justifySelf: "end",
                  border: "none",
                  cursor: "pointer",
                }}
                disabled={clicked}
                onClick={async () => createOrderDetails()}
              >
                Place Order Now
              </button>
            ) : (
              <div
                style={{
                  fontFamily: "Poppins",

                  borderRadius: "100px",
                  color: "black",
                  padding: "10px",
                  backgroundColor: "white",
                  justifySelf: "end",
                  border: "1px solid black",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {items.length > 1 ? "Order Placed" : "No Items Available"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
