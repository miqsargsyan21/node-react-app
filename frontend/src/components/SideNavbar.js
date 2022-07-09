import React, { useContext, useState } from "react";
import Exit from "../images/exit.png";
import Burger from "../images/menu.png";
import Close from "../images/close-white.png";
import "./SideNavbar.css";
import { HomeContext } from "../App";
import { Link, NavLink } from "react-router-dom";

function LeftNavbar() {
  const { handleSetToken, setUserData } = useContext(HomeContext);

  const [isNav, setIsNav] = useState(false);

  const signOut = () => {
    handleSetToken("");
    setUserData({});
  };

  return (
    <>
      <nav className="side-navbar">
        <ul>
          <NavLink activeClassName="active-link" exact to="/">
            <li>Home</li>
          </NavLink>
          <NavLink activeClassName="active-link" to="/userslist">
            <li>User List</li>
          </NavLink>
          <NavLink activeClassName="active-link" to="/teamlist">
            <li>Team List</li>
          </NavLink>
        </ul>
        <div className="exit" onClick={signOut}>
          <img src={Exit} alt={"Exit"} width={"40px"} height={"40px"} />
        </div>
      </nav>

      <div className="burger-container">
        <img src={Burger} onClick={() => setIsNav(true)} />
        <nav className={isNav ? "nav-modal" : "nav-none"}>
          <div className="close">
            <img src={Close} onClick={() => setIsNav(false)} />
          </div>
          <ul>
            <NavLink
              activeClassName="active-link"
              exact
              to="/"
              onClick={() => setIsNav(false)}
            >
              <li>Home</li>
            </NavLink>
            <NavLink
              activeClassName="active-link"
              to="/userslist"
              onClick={() => setIsNav(false)}
            >
              <li>User List</li>
            </NavLink>
            <NavLink
              activeClassName="active-link"
              to="/teamlist"
              onClick={() => setIsNav(false)}
            >
              <li>Team List</li>
            </NavLink>
          </ul>
          <div className="exit" onClick={signOut}>
            <img src={Exit} alt={"Exit"} width={"40px"} height={"40px"} />
          </div>
        </nav>
      </div>
    </>
  );
}

export default LeftNavbar;
