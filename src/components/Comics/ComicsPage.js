import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import Comic from "./Comic";

const ComicsPage = (props) => {
  // Define states. comics will store comics given by the API.
  // Page is used to determine the range of the search, this is used to create multiple pages for the whole comics database.
  // isLoading will be used to dispay a message while the brower get the comics.
  const [comics, setComics] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchComic, setSearchComic] = useState("");
  const [debouncedSearch] = useDebounce(searchComic, 2000);
  const { loggedIn, user, setUser } = props;

  // Create a function to get the datas from the API.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    // Get the comics list, with the search input.
    const apiResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/comics/search`,
      { params: { limit: 100, skip: page * 100 - 100, title: searchComic } }
    );
    const comicsList = apiResponse.data.results;
    setMaxPage(Math.floor(apiResponse.data.count / 100));
    setComics(comicsList);
    setIsLoading(false);
  };

  // Only fetch the datas when the page is rendered.
  useEffect(fetchData, [page, debouncedSearch, searchComic]);

  // createComic will be used to make each Character components.
  const createComic = (comic, index) => {
    return (
      <Comic
        key={comic._id}
        id={comic._id}
        title={comic.title}
        description={comic.description}
        picture={comic.thumbnail}
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

  // Handler to handle user input in the search bar. The page must also be reset to 1 when searching.
  const handleSearchChange = (event) => {
    setSearchComic(event.target.value);
    setPage(1);
  };

  return (
    <div className="ComicsPage Page">
      <input
        id="comicsSearch"
        type="text"
        value={searchComic}
        onChange={handleSearchChange}
        placeholder="Looking for a specific comic?"
      />
      <div className="pagesLink">
        {page !== 1 && (
          <button onClick={handlePageDecrement}>{page - 1}</button>
        )}
        <div className="activePage">{page}</div>
        {page <= maxPage && (
          <button onClick={handlePageIncrement}>{page + 1}</button>
        )}
      </div>
      <div className="comicsSection">
        {isLoading ? <div>Loading...</div> : comics.map(createComic)}
      </div>
    </div>
  );
};

export default ComicsPage;
