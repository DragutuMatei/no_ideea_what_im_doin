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
  console.log(from, to);

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
  }, [, from, to]);

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
    console.log("traf:", traf);

    fail.forEach((ta) => {
      console.log([ta.location.lat, ta.location.lng]);

      try {
        L.marker([ta.location.lat, ta.location.lng], {
          icon: L.icon({
            iconUrl:
              "./masina.png",
            iconSize: [30, 40],
          }),
        }).addTo(map);
      } catch (error) {
        console.log(error);
      }
    });
    const marker = L.marker([from.lat, from.lon], { icon: Icon }).addTo(map);
    const marker2 = L.marker([to.lat, to.lon], { icon: Icon }).addTo(map);

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lon), L.latLng(to.lat, to.lon)],
    }).addTo(map);

    // const points = [
    //   [1, 2],
    //   [2, 3],
    //   [3, 4],
    //   [8, 9],
    //   [9, 10],
    //   [10, 11],
    // ];

    const points = fail.map(f=>{
        return [f.location.lat, f.location.lng]
    })

    const numberOfClusters = 2;
    const clusters = kMeans(points, numberOfClusters);
    console.log("lusters", clusters);

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
          height: "calc(100vh - 100px)",
          marginTop: 100,
        }}
      ></div>
    </>
  );
};

export default Test;
