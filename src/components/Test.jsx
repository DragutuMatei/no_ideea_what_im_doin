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
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
const Test = ({ from, to }) => {
    console.log(from, to);
  useEffect(() => {
    const map = L.map("map").setView([from.lat, from.lon], 11);
    const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: "Leaflet &copy; " + mapLink + ", contribution",
      maxZoom: 15,
    }).addTo(map);

    const taxiIcon = L.icon({
      iconUrl:
        "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
      iconSize: [70, 70],
    });

    const marker = L.marker([from.lat, from.lon], { icon: taxiIcon }).addTo(
      map
    );
    const marker2 = L.marker([to.lat, to.lon], { icon: taxiIcon }).addTo(map);
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lon), L.latLng(to.lat, to.lon)],
    }) 
      .addTo(map);

    return () => {
      if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
      }
      map.off();
      map.remove();
    };
  }, [from, to]); 
 

  return (
    <div
      id="map"
      style={{ width: "100vw", height: "calc(100vh - 100px)", marginTop: 100 }}
    ></div>
  );
};

export default Test;
