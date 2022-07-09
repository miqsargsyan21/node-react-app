import React, { useContext } from "react";
import "./Home.css";
import { HomeContext } from "../App";

function Home() {
  const { userData } = useContext(HomeContext);
  return (
    <main>
      <div>
        <section className="home-container">
          <h1>Welcome Home, {userData.username}</h1>
        </section>
      </div>
    </main>
  );
}

export default Home;
