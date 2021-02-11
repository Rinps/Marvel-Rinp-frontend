import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import favCheckbox from "../assets/images/favorite.png";
import notFavCheckbox from "../assets/images/notFavorite.png";

const Character = (props) => {
  const { id, name, description, picture, user, setUser, loggedIn } = props;
  const [favCharacters, setFavCharacters] = useState({
    list: [],
    checked: "",
  });

  // Check if the user is logged is and, if this is the case, handle the favorite system;
  useEffect(() => {
    if (loggedIn) {
      // The isAFavorite function is used to check if the characters ID is stored inside the user's favorites characters.
      const isAFavorite = () => {
        if (user) {
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
      } else {
        const newObj = {
          list: [...user.favorites.characters],
          checked: notFavCheckbox,
        };
        setFavCharacters(newObj);
      }
    }
  }, [loggedIn, id, user]);

  // Handle the checkbox.
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

  return (
    <div className="Character">
      <img src={`${picture.path}.${picture.extension}`} alt="hero" />
      <Link className="Link" to={`/character/${name}/${id}`}>
        <h1>{name}</h1>
        {description ? <p>{description}</p> : <p>No description</p>}
      </Link>
      {loggedIn && (
        <button className="checkbox" onClick={handleCheckChange}>
          <img className="checkboxImage" src={favCharacters.checked} alt="" />
        </button>
      )}
    </div>
  );
};

export default Character;
