// Load packages
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDumpster, faKey } from "@fortawesome/free-solid-svg-icons";

import CharactersPage from "./components/CharactersPage";
import CharacterDetailPage from "./components/CharacterDetailPage";
import ComicsPage from "./components/ComicsPage";
import FavoritesPage from "./components/FavoritesPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import logo from "./assets/images/logo_Marvel.png";
library.add(faDumpster, faKey);

function App() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get("marvel-token"));
  const [user, setUser] = useState({});

  useEffect(() => {
    // If the browser has the token in its local storage, load the user profile.
    const fetchData = async () => {
      if (loggedIn) {
        try {
          const serverResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/user/access`,
            {
              headers: { Authorization: `Bearer ${loggedIn}` },
            }
          );
          setUser(serverResponse.data);
        } catch (error) {
          console.log(error.res);
        }
      } else {
        setUser({});
      }
    };
    fetchData();
  }, [loggedIn]);

  setTimeout(3000);

  // Handle the logout procedure, triggered when the button "Logout" is clicked on.

  const handleLogout = () => {
    try {
      Cookies.remove("marvel-token");
      setLoggedIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <img src={logo} alt="logo" className="logo" />
          <nav>
            <ul>
              <li className="test">
                <Link className="Link" to="/characters">
                  MARVEL'S CHARACTERS
                </Link>
              </li>
              <li>
                <Link className="Link" to="/comics">
                  MARVEL'S COMICS
                </Link>
              </li>
              {loggedIn && (
                <li>
                  <Link className="Link" to="/favorites">
                    YOUR FAVORITES
                  </Link>
                </li>
              )}
            </ul>
            {loggedIn ? (
              <Link id="logout" to="/">
                <button onClick={handleLogout}>LOGOUT</button>
              </Link>
            ) : (
              <div>
                <Link className="Link" id="login" to="/login">
                  LOGIN
                </Link>
                <Link
                  className="Link"
                  id="signup"
                  to="/signup"
                  style={{ textDecoration: "none" }}
                >
                  SIGNUP
                </Link>
              </div>
            )}
          </nav>
        </header>

        <Switch>
          <Route path="/comics">
            <ComicsPage loggedIn={loggedIn} user={user} setUser={setUser} />
          </Route>
          <Route path="/favorites">
            <FavoritesPage loggedIn={loggedIn} user={user} setUser={setUser} />
          </Route>
          <Route path="/character/:name/:id">
            <CharacterDetailPage loggedIn={loggedIn} user={user} />
          </Route>
          <Route path="/signup">
            <SignupPage />
          </Route>
          <Route path="/login">
            <LoginPage setLoggedIn={setLoggedIn} />
          </Route>
          <Route path="/">
            <CharactersPage loggedIn={loggedIn} user={user} setUser={setUser} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
