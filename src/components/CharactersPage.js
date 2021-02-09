import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import Character from "./Character";

const CharactersPage = (props) => {
  // Define states. characters will store characters given by the API.
  // Page is used to determine the range of the search, this is used to create multiple pages for the whole characters database.
  //isLoading will be used to dispay a message while the brower get the characters.
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCharacter, setSearchCharacter] = useState("");
  const [debouncedSearch] = useDebounce(searchCharacter, 2000);
  const { loggedIn, user, setUser } = props;

  // Create a function to get the datas from the API.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    // Get the characters list, with the search if something has been input in the searchbar.
    const apiResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/characters/search`,
      { params: { limit: 100, skip: page * 100 - 100, name: searchCharacter } }
    );
    const charactersList = apiResponse.data.results;
    setMaxPage(Math.floor(apiResponse.data.count / 100));
    setCharacters(charactersList);
    setIsLoading(false);
  };

  // Only fetch the datas when the page is rendered.
  useEffect(fetchData, [page, debouncedSearch]);

  // createCharacter will be used to make each Character components.
  const createCharacter = (character, index) => {
    return (
      <Character
        key={character._id}
        id={character._id}
        name={character.name}
        description={character.description}
        picture={character.thumbnail}
        user={user}
        setUser={setUser}
        loggedIn={loggedIn}
      />
    );
  };

  // Handlers to change the page state.
  const handlePageDecrement = () => {
    setPage(page - 1);
    setIsLoading(true);
  };

  const handlePageIncrement = () => {
    setPage(page + 1);
    setIsLoading(true);
  };

  // Handler to change the search state.
  const handleSearchChange = (event) => {
    setSearchCharacter(event.target.value);

    // Each search should send the user back to the first results page.
    setPage(1);
  };

  return (
    <div className="CharactersPage Page">
      <input
        id="charactersSearch"
        type="text"
        value={searchCharacter}
        onChange={handleSearchChange}
        placeholder="Looking for someone?"
      />
      <div className="pagesLink">
        <p>Result page</p>
        {page !== 1 && (
          <button onClick={handlePageDecrement}>{page - 1}</button>
        )}
        <div className="activePage">{page}</div>
        {page <= maxPage && (
          <button onClick={handlePageIncrement}>{page + 1}</button>
        )}
      </div>
      <div className="charactersSection">
        {isLoading ? <div>Loading...</div> : characters.map(createCharacter)}
      </div>
      <div className="pagesLink">
        <p>Result page</p>
        {page !== 1 && (
          <button onClick={handlePageDecrement}>{page - 1}</button>
        )}
        <div className="activePage">{page}</div>
        {page <= maxPage && (
          <button onClick={handlePageIncrement}>{page + 1}</button>
        )}
      </div>
    </div>
  );
};

export default CharactersPage;
