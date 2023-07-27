import React, { useEffect, useState } from "react";

import Fire from "../utils/Fire";
import { useAuthState } from "react-firebase-hooks/auth";
import { Timestamp } from "firebase/firestore";
const fire = new Fire();
let poate = { lat: 0, lng: 0 };
function Trafic({ from, to }) {
  //console.log(from, to);
  const [user, loading, error] = useAuthState(fire.getuser());
  let [data, setData] = useState({
    user: !loading && user ? user.email : "",
    path: `${from}-${to}`,
    // from !== "" && to !== ""
    //   ? `${from.toLowerCase()}-${to.toLowerCase()}`
    //   : "-",
    createdAt: Timestamp.now(),
    location: { lat: 0, lng: 0 },
  });
  const [medie, setMedie] = useState(0);
  const [is, setis] = useState(false);
  const get = async () => {
    
    const fromto = `${from}-${to}`;
    //console.log(fromto);
    const a = await fire.readDocuments("trafic", ["path", "==", fromto]);
    let me = 0;
    if (a.length != 0) {
      a.forEach(async (el, index) => {

        //AR TRB SA FIE < DAR NU VR SA PIERD DATELE
        if (Timestamp.now().toDate() - el.createdAt.toDate() > 15 * 60 * 1000) {
          let intarziat =
            Timestamp.now().toDate().getHours() -
            el.createdAt.toDate().getHours();
          if (index == 0) {
            me += intarziat;
          } else {
            me += intarziat;
            me /= 2;
          }
          setMedie(me);
        } else {
          setis(false)
          // await fire.deleteDocument("trafic", el.id).then(res=>{
          //   //console.log(res);
          // })
          console.log("S-AU STERS! AYAYE:)");
        }
      });
    }
  };
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    get();
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setData({
              user: user.email,
              path: `${from}-${to}`,
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
  }, [, from, to]);
  const roundit = (num, how) => {
    if (!how) return Math.round(num * 100) / 100;
    else return Math.round(num * how) / how;
  };
  const start = async () => {
    if (!loading && user) {
      setis(true);
      await fire.addItem("trafic", data).then((res) => {
        //console.log(res);
        alert("trafic anuntat");
      });
    } else if (!user) alert("trebuie sa te loghezi!");
  };
  const stop = async () => {
    if (!loading && user) {
      setis(false);
      const docc = await fire.readDocuments("trafic", [
        "user",
        "==",
        user.email,
      ]);
      //console.log(docc);
      await fire.deleteDocument("trafic", docc[0].id).then((res) => {
        alert("trafic sters");
      });
    } else if (!user) alert("trebuie sa te loghezi!");
  };

  return (
    <>
      {medie > 0 && (
        <h2 className="cfr">Aprox. {roundit(medie, 1)}h de intarziere</h2>
      )}
      <div className="ok">
        {!is && (
          <button
            onClick={() => {
              start();
            }}
          >
            start trafic
          </button>
        )}
        <button
          onClick={() => {
            stop();
          }}
        >
          stop trafic
        </button>
      </div>
    </>
  );
}

export default Trafic;
