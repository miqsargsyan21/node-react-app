import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Navbar from "./Navbar";
import SideNavbar from "./SideNavbar";
import TeamList from "./TeamList";
import UserList from "./UserList";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <SideNavbar />
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/userslist">
        <UserList />
      </Route>
      <Route path="/teamlist">
        <TeamList />
      </Route>
    </div>
  );
}

export default Dashboard;
