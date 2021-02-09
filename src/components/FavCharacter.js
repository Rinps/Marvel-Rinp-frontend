import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FavCharacter = (props) => {
  const { characterId, name, description, picture, loggedIn, setUser } = props;

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

  return (
    <div className="Character">
      <img src={picture} alt="" />
      <div>
        <h1>{name}</h1>
        {description ? <p>{description}</p> : <p>No description</p>}
      </div>
      <button className="favDeleteButton" onClick={handleDelete}>
        <FontAwesomeIcon icon="dumpster" />
      </button>
    </div>
  );
};

export default FavCharacter;
