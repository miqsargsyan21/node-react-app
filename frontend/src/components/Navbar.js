import React, {useContext, useEffect, useState} from "react";
import DashboardLogo from "../images/monitor.png";
import ManAvatar from "../images/mannn.png";
import GirlAvatar from "../images/woman.png";
import Flag from "../images/flag.png"

import "./Navbar.css";
import { HomeContext } from "../App";

function MainNavbar () {
  const { userData } = useContext(HomeContext);

  // useEffect(async () => {
  //   // const getUserBirth = async () => {
  //   //   const userMonth = parseInt(userData.dateOfBirth.slice(5,7));
  //   //
  //   //   console.log("User Month",userMonth)
  //   //
  //   //   const userDay = parseInt(userData.dateOfBirth.slice(8,10));
  //   //
  //   //   console.log("User Day",userDay);
  //   //
  //   //   const date = new Date();
  //   //
  //   //   const currentMonth = date.getMonth() + 1;
  //   //
  //   //   const currentDay = date.getDate();
  //   //
  //   //   console.log("Current Month",currentMonth)
  //   //
  //   //   console.log("Current Day",currentDay)
  //   //
  //   //   console.log( typeof  currentMonth)
  //   //   if (currentMonth <= userMonth && userMonth <= currentMonth + 1 && currentDay >= userDay) {
  //   //     console.log("Yess")
  //   //   } else {
  //   //     console.log("NO")
  //   //   }
  //   // };
  //   //
  //   // if (Object.keys(userData).length) {
  //   //    getUserBirth();
  //   // }
  //
  //   })

  return (
    <header>
      <nav className="main-navbar">
        <div className="logo">
          <img src={DashboardLogo} alt="Dashboard" />
          <p>{userData.isAdmin ? "Dashboard" : userData.teamName}</p>
        </div>
        <div className="user-profile">
          <p>{userData.isAdmin ? "Admin" : userData.username}</p>
            <img
                src={
                  userData.gender === "male"
                      ? ManAvatar
                      : userData.gender === "female"
                          ? GirlAvatar
                          : ""
                }
            />
        </div>
      </nav>
    </header>
  );
}

export default MainNavbar;
