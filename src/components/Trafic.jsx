import React, { useEffect, useState } from "react";

import Fire from "../utils/Fire";
import { useAuthState } from "react-firebase-hooks/auth";
import { Timestamp } from "firebase/firestore";
const fire = new Fire();
let poate = { lat: 0, lng: 0 };
function Trafic({ from, to }) {
  const [user, loading, error] = useAuthState(fire.getuser());
  let [data, setData] = useState({
    user: !loading && user ? user.email : "",
    path: from && to ? `${from.toLowerCase()}-${to.toLowerCase()}`:"-",
    createdAt: Timestamp.now(),
    location: { lat: 0, lng: 0 },
  }); 

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setData({
              user: user.email,
              path: `${from.toLowerCase()}-${to.toLowerCase()}`,

              createdAt: Timestamp.now(),
              location: { lat: latitude, lng: longitude },
            });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    if (!loading && user) getLocation();
  }, []);

  const start = async () => {
    if (!loading && user)
      await fire.addItem("trafic", data).then((res) => {
        console.log(res);
      });
  };
  const stop = async () => {
    if (!loading && user) {
      const docc = await fire.readDocuments("trafic", [
        "user",
        "==",
        user.email,
      ]);
      console.log(docc);
      await fire.deleteDocument("trafic", docc[0].id).then((res) => {
        alert("trafic sters");
      });
    }
  };

  return (
    <>
      <button
        onClick={() => {
          start();
        }}
      >
        start trafic
      </button>
      <button
        onClick={() => {
          stop();
        }}
      >
        stop trafic
      </button>
    </>
  );
}

export default Trafic;
