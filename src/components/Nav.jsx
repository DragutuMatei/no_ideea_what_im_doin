import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import $ from "jquery";
import useWindowSize from "../utils/WindowSize";
import Fire from "../utils/Fire";
const fire = new Fire();
function Nav() {
  const [user, loading, error] = useAuthState(fire.getuser());
  const nav = useRef(null);

  const size = useWindowSize();
  const nav_click = () => {
    $("nav ul").slideToggle();
    nav.current.classList.toggle("active");
  };
  const signInWithGoogle = async () => {
    await fire.signInWithGoogle();
  };

  const logout = async () => {
    await fire.logout();
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
            {!loading && !user ? (
              <>
                <li>
                  <a href="#" onClick={signInWithGoogle}>
                    Login
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="#">{user && user.displayName}</a>
                </li>
                <li>
                  <a href="#" onClick={logout}>
                    Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default Nav;
