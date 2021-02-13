import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FavCharacter = (props) => {
  const { characterId, name, description, picture, loggedIn, setUser } = props;
  const [elementToScroll, setElementToScroll] = useState();

  const handleDelete = async () => {
    const apiResponse = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/user/favCharacter`,
      {
        data: {
          characterId: characterId,
        },
        headers: { Authorization: `Bearer ${loggedIn}` },
      }
    );
    setUser(apiResponse.data);
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
        <img src={picture} alt="" />
      </div>

      <div className="page">
        <div>{description ? description : "No description"}</div>
        {loggedIn && (
          <button className="favDeleteButton" onClick={handleDelete}>
            <FontAwesomeIcon icon="dumpster" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FavCharacter;
