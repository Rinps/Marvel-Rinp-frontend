import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comic from "./Comic";

const CharacterDetailPage = (props) => {
  const { loggedIn, user } = props;
  const { name, id } = useParams();
  const [comics, setComics] = useState([]);
  const [loading, setIsLoading] = useState(true);

  // Retrieve the character's data from the api.
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchData = async () => {
      const apiResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/comics/charactersComics/${id}`
      );

      // Take the comics from the response and store them into a new tab wich is set to be comics state new value.
      const newTab = apiResponse.data;
      setComics(newTab);
      setIsLoading(false);
    };
    fetchData();
  }, [id, setIsLoading]);

  // Define a function to create every Comic components.
  const createComic = (comic, index) => {
    return (
      <Comic
        key={comic._id}
        id={comic._id}
        title={comic.title}
        description={comic.description}
        picture={comic.thumbnail}
        user={user}
        loggedIn={loggedIn}
      />
    );
  };

  return (
    <div className="CharacterDetailPage Page">
      {loading ? (
        <p>Loading character's data</p>
      ) : (
        <>
          <h1>{name}</h1>
          <p>This hero appeared in these comics</p>
          <div className="comicsSection">{comics.map(createComic)}</div>
        </>
      )}
    </div>
  );
};

export default CharacterDetailPage;
