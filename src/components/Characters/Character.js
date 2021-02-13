import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import favCheckbox from "../../assets/images/favorite.png";
import notFavCheckbox from "../../assets/images/notFavorite.png";

const Character = (props) => {
  const { id, name, description, picture, user, setUser, loggedIn } = props;
  const [favCharacters, setFavCharacters] = useState({
    list: [],
    checked: "",
  });
  const [elementToScroll, setElementToScroll] = useState();

  // Check if the user is logged is and, if this is the case, handle the favorite system;
  useEffect(() => {
    if (loggedIn) {
      // The isAFavorite function is used to check if the characters ID is stored inside the user's favorites characters.
      const isAFavorite = () => {
        if (user && user.favorites) {
          const result = user.favorites.characters.filter((favCharacter) => {
            return favCharacter.characterId === id;
          });
          return result.length;
        } else {
          return 0;
        }
      };

      // If the isAFavorite return a number greater than 0, the character is in the favorite list. We update the favCharacters with datas that depends on this result.
      if (isAFavorite()) {
        const newObj = {
          list: [...user.favorites.characters],
          checked: favCheckbox,
        };
        setFavCharacters(newObj);
      } else if (user && user.favorites) {
        const newObj = {
          list: [...user.favorites.characters],
          checked: notFavCheckbox,
        };
        setFavCharacters(newObj);
      }
    }
  }, [loggedIn, id, user]);

  // Handle the favorite image, which must behave like a checkbox.
  const handleCheckChange = async () => {
    // The function will either add a favorite or remove it, depending of the initial state of the checkbox.
    if (favCharacters.checked === favCheckbox) {
      // Send a request to the server.
      try {
        const apiResponse = await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/user/favCharacter`,
          {
            data: {
              characterId: id,
            },
            headers: { Authorization: `Bearer ${loggedIn}` },
          }
        );
        // And update the favCharacters state (put the new favorite list and the adequate image), as well as the user.
        setFavCharacters({
          list: [...favCharacters.list],
          checked: notFavCheckbox,
        });
        setUser(apiResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        // Send a request to the server.
        const apiResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/user/favCharacter`,
          {
            characterId: id,
            name: name,
            description: description,
            picture: `${picture.path}.${picture.extension}`,
          },
          { headers: { Authorization: `Bearer ${loggedIn}` } }
        );
        // And update the favCharacters state, as well as the user.
        setFavCharacters({
          list: [...favCharacters.list],
          checked: favCheckbox,
        });
        setUser(apiResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  // The character's data displayed depends on wether or not the user's mouse is hovering on this character's sheet.
  const handleHover = (event) => {
    console.log("target", event.target);
    const target = event.target.parentElement;
    target.scrollBy({ left: 200, behavior: "smooth" });
    setElementToScroll(target);
  };

  const handleNoHovering = () => {
    if (elementToScroll) {
      elementToScroll.scrollBy({ left: -200, behavior: "smooth" });
      setElementToScroll();
    }
  };

  return (
    <div
      className="Character"
      onMouseEnter={handleHover}
      onMouseLeave={handleNoHovering}
    >
      <div className="cover"></div>
      <div className="page">
        <div className="name">
          <h1>{name.toUpperCase()}</h1>
        </div>
        <img src={`${picture.path}.${picture.extension}`} alt="" />
      </div>

      <div className="page">
        <Link className="Link" to={`/character/${name}/${id}`}>
          {description ? description : "No description"}
        </Link>
        {loggedIn && (
          <button className="checkbox" onClick={handleCheckChange}>
            <img className="checkboxImage" src={favCharacters.checked} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Character;
