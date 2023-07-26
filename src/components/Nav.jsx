import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import useWindowSize from "../utils/WindowSize";

function Nav() {
  const nav = useRef(null);

  const size = useWindowSize();
  const nav_click = () => {
    $("nav ul").slideToggle();
    nav.current.classList.toggle("active");
  };

  return (
    <section className="navigation">
      <div className="nav-container">
        <div className="brand">
          <Link to="/">
            <h1>Better ways</h1>
          </Link>
        </div>
        <nav>
          <div className="nav-mobile">
            <a id="nav-toggle" href="#!" onClick={nav_click} ref={nav}>
              <span></span>
            </a>
          </div>
          <ul className="nav-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/test">Test</Link>
            </li>
            <li>
              <Link to="/despre">Despre</Link>
            </li>
            <li>
              <Link to="/shop/all">Shop</Link>
            </li>
            <li>
              <Link to="/apps">Apps</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/sponsors">Sponsors</Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default Nav;
