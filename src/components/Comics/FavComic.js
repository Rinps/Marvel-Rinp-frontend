import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FavComic = (props) => {
  const { comicId, title, description, picture, loggedIn, setUser } = props;
  const [elementToScroll, setElementToScroll] = useState();

  const handleDelete = async () => {
    const apiResponse = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/user/favComic`,
      {
        data: {
          comicId: comicId,
        },
        headers: { Authorization: `Bearer ${loggedIn}` },
      }
    );
    setUser(apiResponse.data);
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
        <img src={picture} alt="" />
      </div>

      <div className="page">
        <p>{description ? description : "No description"}</p>
        {loggedIn && (
          <button className="favDeleteButton" onClick={handleDelete}>
            <FontAwesomeIcon icon="dumpster" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FavComic;
