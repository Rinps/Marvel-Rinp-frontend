import { useState, useEffect } from "react";
import FavCharacter from "./FavCharacter";
import FavComic from "./FavComic";

const FavoritesPage = (props) => {
  // Extract props
  const { loggedIn, user, setUser } = props;
  const [favorites, setFavorites] = useState({ comics: [], characters: [] });

  // This useEffect is used in case of a manuel refresh of the page. This way, we are sure that the app have store an object inside the user state.
  useEffect(() => {
    if (user.favorites) {
      const newComicTable = [...user.favorites.comics];
      const newCharacterTable = [...user.favorites.characters];
      const newObj = {
        comics: newComicTable,
        characters: newCharacterTable,
      };
      setFavorites(newObj);
    }
  }, [user, loggedIn]);

  // Create functions to create multiple characters and comics sheet on the page. These sheets will behave differently from those we can access on the homepage and comicpage, so we'll use other Components.
  const createFavCharacter = (character, index) => {
    return (
      <FavCharacter
        key={character.characterId}
        characterId={character.characterId}
        name={character.name}
        description={character.description}
        picture={character.picture}
        loggedIn={loggedIn}
        user={user}
        setUser={setUser}
      />
    );
  };

  const createFavComic = (comic, index) => {
    return (
      <FavComic
        key={comic.comicId}
        comicId={comic.comicId}
        title={comic.title}
        description={comic.description}
        picture={comic.picture}
        loggedIn={loggedIn}
        user={user}
        setUser={setUser}
      />
    );
  };

  return (
    <div className="FavoritesPage Page">
      <div>
        <h1>Your favorite heroes</h1>
        {favorites.characters.map(createFavCharacter)}
      </div>
      <div>
        <h1>Your favorite comics</h1>
        {favorites.comics.map(createFavComic)}
      </div>
    </div>
  );
};

export default FavoritesPage;
