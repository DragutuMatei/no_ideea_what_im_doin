import React, { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Test from "./Test";
import Trafic from "./Trafic";

function Home({ set1, set2 }) {
  const [loc1, setLoc1] = useState(null);
  const [locs1, setLocs1] = useState(null);
  const [loc2, setLoc2] = useState(null);
  const [locs2, setLocs2] = useState(null);
  const [gata, setGata] = useState(false);
  const [val1, sv1] = useState(null);
  const [val2, sv2] = useState(null);
  const search1 = async (val) => {
    const after_link = new URLSearchParams({
      q: val,
      format: "json",
      addessdetalis: 1,
      polygon: true,
    }).toString();
    console.log(after_link);
    const link = `https://nominatim.openstreetmap.org/search?q=Tecuci&format=json&addessdetalis=1&polygon_geojson=0`;
    axios.get(link).then((res) => {
      console.log(res);
      setLocs1(res.data);
    });
  };
  const search2 = async (val) => {
    const after_link = new URLSearchParams({
      q: val,
      format: "json",
      addessdetalis: 1,
      polygon: true,
      // polygon_geojson: 0,
    }).toString();
    //q=Tecuci&format=json&addessdetalis=1&polygon=true
    // https://nominatim.openstreetmap.org/search?q=Tecuci&format=json&addessdetalis=1&polygon=true
    const link = `https://nominatim.openstreetmap.org/search?${after_link}`;
    axios.post(link).then((res) => {
      setLocs2(res.data);
    });
  };
  const search = () => {
    console.log(loc1, loc2);
    set1(loc1);
    set2(loc2);
    setGata(true);
  };

  useEffect(() => {
    AOS.init();
  }, []);
  const restet = () => {
    setLoc1(null);
    setLoc2(null);
    setGata(false);
    setLocs1([]);
    setLocs2([]);
  };
  return (
    <div className="main">
      <div className="home">
        <div className="left">
          <h2 data-aos="fade-right">Better</h2>
          <h1 data-aos="fade-right" data-aos-delay={500}>
            WAYS
          </h1>
          <p data-aos="fade-right" data-aos-delay={800}>
            Gaseste modalitati mai <br /> bune de a calatori!
          </p>
        </div>
        <div className="right" data-aos="fade-left">
          <img src={require("../utils/home.svg").default} alt="" />
        </div>
        <a href="#nu">
          <img
            data-aos="fade-down"
            src={require("../utils/downbad.svg").default}
            className="abs"
            alt=""
          />
        </a>
      </div>
      <div className="top" id="nu">
        <div className="input_grup">
          <input type="text" onChange={(e) => sv1(e.target.value)} />
          <button onClick={() => search1(val1)}>cauta prima locatie</button>
          <div className="maps">
            {locs1 &&
              !loc1 &&
              locs1.map((loc) => {
                return (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setLoc1(loc)}
                  >
                    <h2>{loc.display_name}</h2>
                  </div>
                );
              })}
          </div>
        </div>
        {!loc1 && (
          <div className="input_group">
            <input type="text" onChange={(e) => sv2(e.target.value)} />
            <button onClick={() => search2(val2)}>cauta a doua locatie</button>
            <div className="maps">
              {locs2 &&
                !loc2 &&
                locs2.map((loc) => {
                  return (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setLoc2(loc)}
                    >
                      <h2>{loc.display_name}</h2>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        <button onClick={search}>Search</button>
        <button onClick={restet}>Reset</button>
      </div>
      <Trafic from={loc1} to={loc2} />

      {gata && (
        <>
          <Test from={loc1} to={loc2} />
        </>
      )}
    </div>
  );
}

export default Home;
