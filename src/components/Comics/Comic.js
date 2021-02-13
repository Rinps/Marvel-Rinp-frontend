import { useState, useEffect } from "react";
import axios from "axios";
import favCheckbox from "../../assets/images/favorite.png";
import notFavCheckbox from "../../assets/images/notFavorite.png";

const Comic = (props) => {
  const { id, title, description, picture, user, setUser, loggedIn } = props;
  const [favComics, setFavComics] = useState({
    list: [],
    checked: "",
  });
  const [elementToScroll, setElementToScroll] = useState();

  // Check if the user is logged in and, if this is the case, handle the favorite system;
  useEffect(() => {
    if (loggedIn) {
      if (user && user.favorites) {
        // The isAFavorite function is used to check if the comic ID is stored inside the user's favorites comics.
        const isAFavorite = () => {
          const result = user.favorites.comics.filter((favComic) => {
            return favComic.comicId === id;
          });
          return result.length;
        };

        // If the isAFavorite return a number greater than 0, the character is in the favorite list. We update the favCharacters with datas that depends on this result.
        if (isAFavorite()) {
          setFavComics({
            list: [...user.favorites.comics],
            checked: favCheckbox,
          });
        } else {
          setFavComics({
            list: [...user.favorites.comics],
            checked: notFavCheckbox,
          });
        }
      }
    }
  }, [loggedIn, id, user]);

  // Handle the checkbox state change.
  const handleCheckChange = async () => {
    // The function will either add a favorite or remove it, depending of the initial state of the checkbox.
    if (favComics.checked === favCheckbox) {
      // Send a request to the server
      try {
        const apiResponse = await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/user/favComic`,
          {
            data: {
              comicId: id,
            },
            headers: { Authorization: `Bearer ${loggedIn}` },
          }
        );
        // And update the favComics state (put the new favorite list and the adequate image), as well as the user.
        setFavComics({
          list: [...favComics.list],
          checked: notFavCheckbox,
        });
        setUser(apiResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        const apiResponse = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/user/favComic`,
          {
            comicId: id,
            title: title,
            description: description,
            picture: `${picture.path}.${picture.extension}`,
          },
          { headers: { Authorization: `Bearer ${loggedIn}` } }
        );
        // And update the favComics state (put the new favorite list and the adequate image), as well as the user.
        const newObj = { list: [...favComics.list], checked: favCheckbox };
        setFavComics(newObj);
        console.log("test", favComics);
        setUser(apiResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  // The comic's data displayed depends on wether or not the user's mouse is hovering on this comic's sheet.
  const handleHover = (event) => {
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
      className="Comic"
      onMouseEnter={handleHover}
      onMouseLeave={handleNoHovering}
    >
      <div className="cover"></div>
      <div className="page">
        <div className="title">
          <h1>{title.toUpperCase()}</h1>
        </div>
        <img src={`${picture.path}.${picture.extension}`} alt="" />
      </div>

      <div className="page">
        <p>{description ? description : "No description"}</p>
        {loggedIn && (
          <button className="checkbox" onClick={handleCheckChange}>
            <img className="checkboxImage" src={favComics.checked} alt="" />
          </button>
        )}
      </div>
    </div>
    /* <div className="Comic">
      <img src={`${picture.path}.${picture.extension}`} alt="hero" />
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : <p>No description</p>}
      </div>
      {loggedIn && (
        <button className="checkbox" onClick={handleCheckChange}>
          <img className="checkboxImage" src={favComics.checked} alt="" />
        </button>
      )}
    </div> */
  );
};

export default Comic;
