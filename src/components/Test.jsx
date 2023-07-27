// import React, { useEffect, useState } from "react";
// import L from "leaflet";
// import "leaflet-routing-machine";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// const Test = ({ from, to }) => {
//   console.log(from, to);
//   useEffect(() => {
//     const map = L.map("map").setView([from.lat, from.lon], 11);
//     const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
//     L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
//       attribution: "Leaflet &copy; " + mapLink + ", contribution",
//       maxZoom: 18,
//     }).addTo(map);

//     const taxiIcon = L.icon({
//       iconUrl:
//         "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
//       iconSize: [70, 70],
//     });

//     const marker = L.marker([from.lat, from.lon], { icon: taxiIcon }).addTo(
//       map
//     );
//     const marker2 = L.marker([to.lat, to.lon], { icon: taxiIcon }).addTo(map);

//     L.Routing.control({
//       waypoints: [L.latLng(from.lat, from.lon), L.latLng(to.lat, to.lon)],
//     })
//       .on("routesfound", function (e) {
//         var route = e.route;
//       })
//       .addTo(map);

//     // map.on("locationfound", function (e) {
//     // //   console.log(e);
//     // //   var newMarker = L.marker([
//     // //     e.latlng.lat,
//     // //     e.latlng.lng,
//     // //     {
//     // //       icon: L.icon({
//     // //         iconUrl:
//     // //           "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
//     // //         iconSize: [70, 70],
//     // //       }),
//     // //     },
//     // //   ]).addTo(map);
//     //   L.Routing.control({
//     //     waypoints: [L.latLng(from.lat, from.lon), L.latLng(to.lat, to.lon)],
//     //   })
//     //     .on("routesfound", function (e) {
//     //       var routes = e.routes;
//     //       console.log(routes);

//     //     //   e.routes[0].coordinates.forEach(function (coord, index) {
//     //     //     setTimeout(function () {
//     //     //       marker.setLatLng([coord.lat, coord.lng]);
//     //     //     }, 100 * index);
//     //     //   });
//     //     })
//     //     .addTo(map);
//     // });

//     // Clean up when the component is unmounted
//     return () => {
//       map.off();
//       map.remove();
//     };
//   }, []);
//   useEffect(() => {
//     console.log(from, to);
//   }, []);
//   return (
//     <div
//       id="map"
//       style={{ width: "100vw", height: "calc(100vh - 100px)", marginTop: 100 }}
//     ></div>
//   );
// };

// export default Test;
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import Fire from "../utils/Fire";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { data } from "jquery";

const fire = new Fire();
const Test = ({ from, to }) => {
  let [fail, setFail] = useState([]);

  const traf = useRef(null);
  console.log(from, to);
  const get = async () => {
    const fromto = `${from?.display_name}-${to?.display_name}`;
    console.log(fromto);
    // traf.current = await fire.readDocuments("trafic", ["path", "==", fromto]);
    // setTraf(old=>old=a);
  };

  useEffect(() => {
    const q = query(
      collection(fire.getDb(), "trafic"),
      where("path", "==", `${from?.display_name}-${to?.display_name}`)
    );
    onSnapshot(q, (querySnapshot) => {
      var ok = [];
      let i = 0;
      querySnapshot.forEach((doc) => {
        ok[i] = doc.data();
        console.log(doc.data());
        console.log(i, ok);
        i++;
        // setFail((old) => [doc.data(), ...old]);
      });
      console.log("okkk", ok);
      setFail(ok);
    });
    get();
  }, [, from, to]);

  useEffect(() => {
    const map = L.map("map").setView([from.lat, from.lon], 11);
    const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: "Leaflet &copy; " + mapLink + ", contribution",
      maxZoom: 15,
    }).addTo(map);
    get();

    const taxiIcon = L.icon({
      iconUrl:
        "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
      iconSize: [70, 70],
    });
    console.log("traf:", traf);
  
    const fromto = `${from?.display_name}-${to?.display_name}`;

    fail.forEach((ta) => {
      console.log([ta.location.lat, ta.location.lng]);
      try {
        L.marker([ta.location.lat, ta.location.lng], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/4463/4463660.png",
            iconSize: [50, 50],
          }),
        }).addTo(map);
      } catch (error) {
        console.log(error);
      }
    });  const marker = L.marker([from.lat, from.lon], { icon: taxiIcon }).addTo(
      map
    );
    const marker2 = L.marker([to.lat, to.lon], { icon: taxiIcon }).addTo(map);

    // console.log(traf.current);
    // traf.current.map((ta) => {
    //   console.log([ta.location.lat, ta.location.lng]);
    //   L.marker([ta.location.lat, ta.location.lng], {
    //     icon: taxiIcon,
    //   }).addTo(map);
    // });

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lon), L.latLng(to.lat, to.lon)],
    }).addTo(map);

    return () => {
      if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
      }
      map.off();
      map.remove();
    };
  }, [, from, to, fail]);

  return (
    <>
      <div
        id="map"
        style={{
          width: "100vw",
          height: "calc(100vh - 100px)",
          marginTop: 100,
        }}
      ></div>
    </>
  );
};

export default Test;
