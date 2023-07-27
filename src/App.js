import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Test from "./components/Test";
import Nav from "./components/Nav";
import "./utils/style.scss";
import { useEffect, useState } from "react";
function App() {
  const[from, set1] = useState(null)
  const[to, set2] = useState(null)
  
  useEffect(() => {
  },[from, to]);
  return (
    <BrowserRouter>
  <Nav/>
      <Routes>
        <Route path="/" element={<Home set1={set1} set2={set2} />} />
        {/* <Route path="/test" element={<Test  from={from} to={to} />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
