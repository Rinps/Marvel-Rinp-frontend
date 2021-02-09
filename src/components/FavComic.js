import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FavComic = (props) => {
  const { comicId, title, description, picture, loggedIn, setUser } = props;

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

  return (
    <div className="Comic">
      <img src={picture} alt="" />
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : <p>No description</p>}
      </div>
      <button className="favDeleteButton" onClick={handleDelete}>
        <FontAwesomeIcon icon="dumpster" />
      </button>
    </div>
  );
};

export default FavComic;
