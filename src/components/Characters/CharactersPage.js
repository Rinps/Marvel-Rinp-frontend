import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import Character from "./Character";

const CharactersPage = (props) => {
  // Define states. characters will store characters given by the API.
  // Page is used to determine the range of the search, this is used to create multiple pages for the whole characters database.
  //isLoading will be used to dispay a message while the brower get the characters.
  const [characters, setCharacters] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pagesList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  });
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
      {
        params: {
          limit: 100,
          skip: pagination.page * 100 - 100,
          name: searchCharacter,
        },
      }
    );
    const charactersList = apiResponse.data.results;
    setMaxPage(Math.floor(apiResponse.data.count / 100));
    setCharacters(charactersList);
    setIsLoading(false);
  };

  // Only fetch the datas when the page is rendered.
  useEffect(fetchData, [pagination, debouncedSearch, searchCharacter]);

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

  // createPagination create the JSX components of the pagination. It is used to iterate throught the pagesList state.
  const createPagination = (pageNumber, index) => {
    if (pageNumber === pagination.page) {
      return (
        <div className="activePage" key={index}>
          {pageNumber}
        </div>
      );
    } else {
      return (
        <button onClick={handlePageClick} value={pageNumber} key={index}>
          {pageNumber}
        </button>
      );
    }
  };

  // Handlers to change the page state.
  const handlePageClick = (event) => {
    console.log("maxPage", maxPage);
    // We now plan on displaying 11 pages at once, and the active page must be in the center. So there must be 5 number on its right and its left.
    const newPage = event.target.value;
    const newTab = [];
    if (newPage > 5 && newPage < maxPage - 5) {
      // Then create the html code.
      for (let i = newPage - 5; i <= 11; i++) {
        newTab.push(i);
      }
    } else if (newPage < 5) {
      for (let i = 0; i < 12; i++) {
        newTab.push(i);
      }
    } else {
      for (let i = maxPage - 11; i <= maxPage; i++) {
        newTab.push(i);
      }
    }
    setPagination({ page: newPage, pagesList: newTab });
    setIsLoading(true);
  };

  // Handler to change the search state.
  const handleSearchChange = (event) => {
    setSearchCharacter(event.target.value);

    // Each search should send the user back to the first results page.
    setPagination({ page: 1, pagesList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
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
        {pagination.pagesList.map(createPagination)}
      </div>
      <div className="charactersSection">
        {isLoading ? <div>Loading...</div> : characters.map(createCharacter)}
      </div>
    </div>
  );
};

export default CharactersPage;
