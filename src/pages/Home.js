import Navbar from "../Navbar";
import Search from "../components/Search";
import { Route, Router, Routes } from "react-router-dom";
import Menu from "../components/Menu";
import CuisineFilter from "../components/cousine_filter";
import { useEffect, useState } from "react";
import { onSnapshot, doc,  } from "firebase/firestore";
import { db } from "../firebase/Firebase";

function Home() {
  const [items, setItems] = useState([{}])

  useEffect(() => {
    const fetchData = () => {
      try {
        const document = onSnapshot(doc(db, "menu_items_homepage", "menu"), (doc) => {
          try {
            setItems(doc.data().items);
          } catch (e) {
            
          }
        });
        const document_2 = onSnapshot(doc(db, "users", sessionStorage.getItem("email")), (doc) => {
          try {
            sessionStorage.setItem("name",(doc.data().name));
            sessionStorage.setItem("chefzipCode",(doc.data().zipCode))
            sessionStorage.setItem("aboutMe",(doc.data().aboutMe))
            sessionStorage.setItem("pfp", (doc.data().profilePicture))
            sessionStorage.setItem("openTimeStart", (doc.data().openHoursStart))
            sessionStorage.setItem("openTimeEnd", (doc.data().openHoursEnd))
            sessionStorage.setItem("availability", JSON.stringify((doc.data().availability)))
            sessionStorage.setItem("telegramId", (doc.data().telegramID))
            sessionStorage.setItem("phoneNumber", (doc.data().phoneNumber))
            if (!sessionStorage.getItem("zipCode")) {
              sessionStorage.setItem("zipCode", doc.data().zipCode);
            }
          } catch (e) {
            
          }
        });
      
      const document_3 = onSnapshot(doc(db, "users", sessionStorage.getItem("email")), (doc) => {
        try {
          sessionStorage.setItem("items",JSON.stringify((doc.data().items)));
        } catch (e) {

        }
      });
      } catch (error) {
        alert("Error");
      }
    };
    fetchData();
  }, []);
  return (
    <div className="App">
      <Navbar />
      <Search />
      <CuisineFilter />
      <Menu items={items} />
    </div>
  );
}

export default Home;
