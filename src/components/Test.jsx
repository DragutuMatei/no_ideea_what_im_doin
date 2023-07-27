import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import axios from "axios";
import Fire from "../utils/Fire";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const fire = new Fire();
const Test = ({ from, to }) => {
  let [fail, setFail] = useState([]);

  const traf = useRef(null);
  //console.log(from, to);

  useEffect(() => {
    let emp = false;
    console.log(emp);
    if (!emp) {
      let q = query(
        collection(fire.getDb(), "trafic"),
        where("path", "==", `${from?.display_name}-${to?.display_name}`)
      );
      onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          emp = true;
            console.log("este gol")
            let q = query(
                collection(fire.getDb(), "trafic"),
                where("path", "==", `${to?.display_name}-${from?.display_name}`)
              );
              onSnapshot(q, (querySnapshot) => {
                if (querySnapshot.empty) {
                  emp = true;
                  console.log("este nu ")
                }
                var ok = [];
                let i = 0;
                querySnapshot.forEach((doc) => {
                  ok[i] = doc.data();
                  //console.log(doc.data());
                  //console.log(i, ok);
                  i++;
                  // setFail((old) => [doc.data(), ...old]);
                });
                console.log("okkk", ok);
                setFail(ok);
              });
        }
        var ok = [];
        let i = 0;
        querySnapshot.forEach((doc) => {
          ok[i] = doc.data();
          console.log(doc.data());
          //console.log(i, ok);
          i++;
          // setFail((old) => [doc.data(), ...old]);
        });
        console.log("okkk", ok);
        setFail(ok);
      });

    } else {
    //   let q = query(
    //     collection(fire.getDb(), "trafic"),
    //     where("path", "==", `${to?.display_name}-${from?.display_name}`)
    //   );
    //   onSnapshot(q, (querySnapshot) => {
    //     if (querySnapshot.empty) {
    //       emp = true;
    //       console.log("este nu ")
    //     }
    //     var ok = [];
    //     let i = 0;
    //     querySnapshot.forEach((doc) => {
    //       ok[i] = doc.data();
    //       //console.log(doc.data());
    //       //console.log(i, ok);
    //       i++;
    //       // setFail((old) => [doc.data(), ...old]);
    //     });
    //     console.log("okkk", ok);
    //     setFail(ok);
    //   });
    }
  }, [, from, to]);
  const avoidingDistance = 1200;
  function calculateDistance(point1, point2) {
    const earthRadiusKm = 6371; // Earth's radius in kilometers

    const lat1 = degreesToRadians(point1.lat);
    const lon1 = degreesToRadians(point1.lng);
    const lat2 = degreesToRadians(point2.lat);
    const lon2 = degreesToRadians(point2.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = earthRadiusKm * c;
    const distanceMeters = distanceKm * 1000;
    return distanceMeters; // Distance in meters
  }
  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  useEffect(() => {
    const map = L.map("map").setView([from.lat, from.lon], 11);
    const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";
    L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution: "Leaflet &copy; " + mapLink + ", contribution",
      maxZoom: 15,
    }).addTo(map);

    const Icon = L.icon({
      iconUrl:
        "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-512.png",
      iconSize: [70, 70],
    });
    //console.log("traf:", traf);

    const points = fail.map((f) => {
      return [f.location.lat, f.location.lng];
    });

    let raza = [],
      media_x = [],
      media_y = [],
      maxx = [];

    const numberOfClusters = 2;
    const clusters = kMeans(points, numberOfClusters);
    console.log("lusters", clusters);

    // clusters.forEach((clust, index) => {
    //   let sum_x = 0,
    //     sum_y = 0,
    //     i = 1,
    //     maxx = 0;

    //   clust.forEach((cl) => {
    //     sum_x += cl[0];
    //     sum_y += cl[1];
    //     if (maxx > cl[0]) {
    //     //   maxx = cl[0];
    //     console.log(cl[0])
    //     }
    //     i++;
    //   });
    //   maxx[index] = maxx;
    //   media_y[index] = sum_y / i;
    //   media_x[index] = sum_x / i;
    // });

    // let dif = [];
    // for (let j = 0; j < 2; j++) {
    //   dif[j] = maxx[j] - media_x[j];
    // }
    // let ways = [L.latLng(from.lat, from.lon)];
    // let i = 1;
    fail.forEach((ta) => {
      //console.log([ta.location.lat, ta.location.lng]);

      try {
        L.marker([ta.location.lat, ta.location.lng], {
          icon: L.icon({
            iconUrl: "./masina.png",
            iconSize: [30, 40],
          }),
        }).addTo(map);
        // ways[i] = L.latLng(ta.location.lat, ta.location.lng );
        // i++;
      } catch (error) {
        //console.log(error);
      }
    });
    const marker = L.marker([from.lat, from.lon], { icon: Icon }).addTo(map);
    const marker2 = L.marker([to.lat, to.lon], { icon: Icon }).addTo(map);

    // ways.push(L.latLng(to.lat, to.lon));

    ////console.log(ways);

    let routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lon), L.latLng(to.lat, to.lon)],
      //   waypoints: ways,
    }).addTo(map);
    var waypoints = [];

    routingControl.on("routeselected", async (e) => {
      const routeNodes = e.route.coordinates;
      // console.log(routeNodes)
      Object.keys(routeNodes).forEach((index) => {
        let node = routeNodes[index];
        // console.log(node)
        fail.forEach((ta) => {
          let nope = L.latLng(ta.location.lat, ta.location.lng);
          if (calculateDistance(node, nope) <= 300) {
            // console.log("avem unul")
            // console.log("move to:", calculateDestinationPointToLeft(nope, 500))
            let inter = calculateDestinationPointToLeft(nope, avoidingDistance);
            let interNode = L.latLng(inter.lat, inter.lng);
            // console.log(interNode)
            if (!waypoints.includes(interNode)) {
              waypoints.push(interNode);
            }
          }
        });
      }); if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
      }
      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(from.lat, from.lon),
          ...waypoints,
          L.latLng(to.lat, to.lon),
        ],
      }).addTo(map);
    });
    // var draggable = new L.Draggable(routingControl);
    // draggable.enable();

    // const points = [
    //   [1, 2],
    //   [2, 3],
    //   [3, 4],
    //   [8, 9],
    //   [9, 10],
    //   [10, 11],
    // ];

    // clusters.forEach(e=>{
    //     e.forEach(s=>{
    //         L.circle([s[0], s[1]], 100).addTo(map);
    //     })
    // })

    return () => {
      if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
      }
      map.off();
      map.remove();
    };
  }, [, from, to, fail]);
  function calculateDestinationPointToLeft(startPoint, distanceMeters) {
    const earthRadiusKm = 6371; // Earth's radius in kilometers
    const avgLongitudeDegreeLengthKm = (2 * Math.PI * earthRadiusKm) / 360; // Approximate longitude degree length at the equator

    const distanceKm = distanceMeters / 1000;
    const newLongitude =
      startPoint.lng - distanceKm / avgLongitudeDegreeLengthKm;

    return { lat: startPoint.lat, lng: newLongitude };
  }

  function distance(point1, point2) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  function assignPointsToClusters(points, centroids) {
    const clusters = new Array(centroids.length).fill().map(() => []);

    for (const point of points) {
      let minDistance = Infinity;
      let clusterIndex = -1;

      for (let i = 0; i < centroids.length; i++) {
        const centroid = centroids[i];
        const dist = distance(point, centroid);

        if (dist < minDistance) {
          minDistance = dist;
          clusterIndex = i;
        }
      }

      clusters[clusterIndex].push(point);
    }

    return clusters;
  }

  function calculateCentroids(clusters) {
    return clusters.map((cluster) => {
      const sumX = cluster.reduce((acc, point) => acc + point[0], 0);
      const sumY = cluster.reduce((acc, point) => acc + point[1], 0);
      const meanX = sumX / cluster.length;
      const meanY = sumY / cluster.length;
      return [meanX, meanY];
    });
  }

  function kMeans(points, k, maxIterations = 100) {
    let centroids = points.slice(0, k);
    let iteration = 0;

    while (iteration < maxIterations) {
      const clusters = assignPointsToClusters(points, centroids);
      const newCentroids = calculateCentroids(clusters);

      if (JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
        break;
      }

      centroids = newCentroids;
      iteration++;
    }

    return assignPointsToClusters(points, centroids);
  }

  return (
    <>
      <div
        id="map"
        style={{
          width: "100vw",
          height: "calc(100vh - 200px)",
          marginTop: 100,
        }}
      ></div>
    </>
  );
};

export default Test;
