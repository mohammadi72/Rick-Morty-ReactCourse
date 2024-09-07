import "./App.css";
import CharacterDetail from "./components/CharacterDetail";
import CharacterList from "./components/CharacterList";
import Navbar, { SearchResult, Search, Favourites } from "./components/Navbar";
import Modal from "./components/Modal";
import { toast, Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, SetSelectedId] = useState(null);
  const [favourites, setFavourites] = useState(
    (() => JSON.parse(localStorage.getItem("FAVOURITES")) ) || []
  );
  //// useEffect way
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);
  //       const res = await fetch("https://rickandmortyapi.com/api/character");
  //       if (!res.ok) throw new Error("some thing went wrong...");
  //       const data = await res.json();
  //       setCharacters(data.results.slice(0, 5));
  //     } catch (err) {
  //       toast.error(err.message)

  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);
  ////handler function
  // const loadCharacters = () => {
  //   fetch("https://rickandmortyapi.com/api/character")
  //     .then((res) => res.json())
  //     .then((data) => setCharacters(data.results));
  // };
  ////axios
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/?name=${query}`,
          { signal }
        );
        setCharacters(data.results.slice(0, 5));
      } catch (err) {
        if (!axios.isCancel()) {
          setCharacters([]);
          console.log(err);
          toast.error(err.response.data.error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    // if (query.length < 3) {
    //   setCharacters([]);
    //   return;
    // }
    fetchData();

    return () => {
      controller.abort();
    };
  }, [query]);
  useEffect(() => {
    localStorage.setItem("FAVOURITES", JSON.stringify(favourites));
  }, [favourites]);

  const handleSelectCharacter = (id) => {
    SetSelectedId((prevId) => (prevId === id ? null : id));
  };
  const handleAddFavourite = (char) => {
    setFavourites((prevFav) => [...prevFav, char]);
  };

  const handleDeleteFavourite = (id) => {
    setFavourites((prevFav) => prevFav.filter((fav) => fav.id !== id));
  };
  const isAddToFavourites = favourites
    .map((fav) => fav.id)
    .includes(selectedId);
  return (
    <div className="app">
      <Toaster />
      {/* <Modal title="modal title" open={true} >
        thissss
      </Modal> */}
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult numOfResult={characters.length} />
        <Favourites
          favourites={favourites}
          onDeleteFavourite={handleDeleteFavourite}
        />
      </Navbar>
      <div className="main">
        <CharacterList
          selectedId={selectedId}
          characters={characters}
          isLoading={isLoading}
          onSelectCharacter={handleSelectCharacter}
        />
        <CharacterDetail
          selectedId={selectedId}
          onAddFavourite={handleAddFavourite}
          isAddToFavourites={isAddToFavourites}
        />
      </div>
    </div>
  );
}
export default App;
