import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { storage } from "../firebase/Firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { useLocation } from "react-router";
import { getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';


function AddItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageSource, setImageSource] = useState("");
  const [description, setDescription] = useState(
    location.state?.item ? location.state.item.itemTags : ""
  );
  const [name, setName] = useState(
    location.state?.item ? location.state.item.itemName : ""
  );
  const [price, setPrice] = useState(
    location.state?.item ? location.state.item.itemPrice : ""
  );
  const [cuisine, setCuisine] = useState(
    location.state?.item ? location.state.item.itemCuisine : ""
  );
  const [tags, setTags] = useState(
    location.state?.item ? location.state.item.itemTags : ""
  );
  const [portion, setPortion] = useState(
    location.state?.item ? location.state.item.itemPortion : "")
    const [ingridients, setIngridients] = useState(
      location.state?.item ? location.state.item.itemPortion : "")

  // const updateItemList = async () => {
  //   try {
  //     if (imageUpload == null) return;
  //     const imageName = imageUpload.name + v4();
  //     const imageRef = ref(storage, `images/${imageName}`);
  //     uploadBytes(imageRef, imageUpload).then(async()=>{
  //       const url = await getDownloadURL(imageRef)
  //       await updateDoc(doc(db, "users", sessionStorage.getItem("email")), {
  //         items: arrayUnion({
  //           itemName: name,
  //           itemDescription: description,
  //           itemPrice: price,
  //           itemCuisine: cuisine,
  //           itemTags: tags,
  //           itemImage: url,
  //           itemPortion: portion,
  //           itemIngridients: ingridients,
  //           vendorId: sessionStorage.getItem("email"),
  //           vendorName: sessionStorage.getItem("name"),
  //           vendorDistance: sessionStorage.getItem("zipCode"),
  //           vendorTelegramId: sessionStorage.getItem("telegramId")  
  //         }),
  //       });
  
  //       await updateDoc(doc(db, "menu_items_homepage", "menu"), {
  //         items: arrayUnion({
  //           itemName: name,
  //           itemDescription: description,
  //           itemPrice: price,
  //           itemCuisine: cuisine,
  //           itemTags: tags,
  //           itemImage: url,
  //           itemPortion: portion,
  //           itemIngridients: ingridients,
  //           vendorId: sessionStorage.getItem("email"),
  //           vendorName: sessionStorage.getItem("name"),
  //           vendorDistance: sessionStorage.getItem("zipCode"),
  //           vendorTelegramId: sessionStorage.getItem("telegramId")  
  //         }),
  //       });
  
  //     })
  //     console.log(document);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const [loading, setLoading] = useState(false); // New state for loading

  const updateItemList = async () => {
    setLoading(true); // Start loading
    try {
      if (imageUpload == null) return;
      const imageName = imageUpload.name + v4();
      const imageRef = ref(storage, `images/${imageName}`);
      await uploadBytes(imageRef, imageUpload);
      const url = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "users", sessionStorage.getItem("email")), {
        items: arrayUnion({
          itemName: name,
          itemDescription: description,
          itemPrice: price,
          itemCuisine: cuisine,
          itemTags: tags,
          itemImage: url,
          itemPortion: portion,
          itemIngridients: ingridients,
          vendorId: sessionStorage.getItem("email"),
          vendorName: sessionStorage.getItem("name"),
          vendorDistance: sessionStorage.getItem("zipCode"),
          vendorTelegramId: sessionStorage.getItem("telegramId")
        }),
      });

      await updateDoc(doc(db, "menu_items_homepage", "menu"), {
        items: arrayUnion({
          itemName: name,
          itemDescription: description,
          itemPrice: price,
          itemCuisine: cuisine,
          itemTags: tags,
          itemImage: url,
          itemPortion: portion,
          itemIngridients: ingridients,
          vendorId: sessionStorage.getItem("email"),
          vendorName: sessionStorage.getItem("name"),
          vendorDistance: sessionStorage.getItem("zipCode"),
          vendorTelegramId: sessionStorage.getItem("telegramId")
        }),
      });
      navigate("/edit-chef-profile");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false); // Stop loading
    }
  };

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

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleCuisineChange = (event) => {
    setCuisine(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handlePortionChange = (event) => {
    setPortion(event.target.value);
  };

  const handleIngridientsChange = (event) => {
    setIngridients(event.target.value);
  };

  return (
    <div className="App">
      <Navbar />
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>Add a New Item</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ marginRight: "100px" }}>
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
                backgroundImage: imageSource && `url(${imageSource})`,
               
              }}
            >
              {(!imageSource && location.state?.item.itemImage) &&<img
              style={{borderRadius:"10px", objectFit:"cover"}}
                height={200}
                width={200}
                src={
                  location.state?.item.itemImage
                }
              />}
            </div>
            <label style={{justifySelf:"center", marginTop:"10px", textAlign:"center",  padding:"5px 0px", width:"200px"}} htmlFor="file-upload" className="custom-file-upload">
              Upload Item Picture +
            </label>
            <input
              onChange={handleFileChange}
              id="file-upload"
              type="file"
              accept=".png,.jpg, .jpeg"
              style={{ display: "none" }} // Hide the default file input
            />
            <div
              style={{
                display: "flex",
                padding: "20px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Description </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                Describe your home cooked item
              </p>
              <br />
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "350px",
                  outline: "1px solid gainsboro",
                  fontSize: "14px",
                  fontFamily: "Poppins",
                  resize: "none",
                }}
              ></textarea>
            </div>
            <div
              style={{
                display: "flex",
                padding: "20px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Ingridients </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                List each ingridient with a comma
              </p>
              <br />
              <input
                value={ingridients}
                onChange={handleIngridientsChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "350px",
                  outline: "1px solid gainsboro",
                  fontSize: "14px",
                  fontFamily: "Poppins",
                  resize: "none",
                }}
              ></input>
            </div>
          </div>
          <div
            style={{
              height: "510px",
              overflowY: "scroll",
              padding: "0px 10px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "0px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Name </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                Name your item so it's easy to find!
              </p>
              <br />
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "350px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                padding: "20px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Price </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                Give a price for your item
              </p>
              <br />
              <div  style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "350px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                  display:"flex"
                }}>
                <p style={{margin:"0px"}}>$</p>
              <input
                type="number"
                value={price}
                onChange={handlePriceChange}
                placeholder="0.00"
                step={0.01}
                style={{
                  border:"none", outline:"none",  fontSize: "20px", width:"100%"
                }}
              />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Portion </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                How much of this item is served?
              </p>
              <br />
              <input
                type="text"
                value={portion}
                onChange={handlePortionChange}
                placeholder="12 oz"
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "350px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Cuisine </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                What cuisine is the item from?
              </p>
              <br />
              <input
                type="text"
                value={cuisine}
                onChange={handleCuisineChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "350px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 0px",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label>Tags </label>
              <p style={{ margin: "0px", fontSize: "12px", color: "gray" }}>
                Separate each tag with a comma
              </p>
              <br />
              <input
                type="text"
                value={tags}
                onChange={handleTagsChange}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  width: "350px",
                  outline: "1px solid gainsboro",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{
            fontFamily: "Poppins",
            width: "30%",
            borderRadius: "100px",
            color: "white",
            padding: "10px",
            backgroundColor: "black",
            justifySelf: "flex-end",
            marginTop: "30px",
            border: "none",
            margin: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={async () => {
            updateItemList();
          }}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <div style={{
              border: "2px solid white",
              borderTop: "2px solid black",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              animation: "spin 1s linear infinite",
            }}></div>
          ) : (
            "Add Item to My Menu"
          )}
        </button>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AddItem;
