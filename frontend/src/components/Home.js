import React from "react";
import Banner from "./Banner";
import About from "./About";
import Menu from "./Menu";
import Events from "./Events";
import VideoBanner from "./VideoBanner";
import Sponsers from "./Sponsers";
import Map from "./Map";

const Home = () => {
  return (
    <div>
      <Banner />
      <About />
      <Menu />
      <Events />

      <VideoBanner />
      <Sponsers />
      <Map />
    </div>
  );
};

export default Home;
