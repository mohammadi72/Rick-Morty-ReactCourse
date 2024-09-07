import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader";
function CharacterDetail({ selectedId, onAddFavourite, isAddToFavourites }) {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  //how to fetch single character data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `https://rickandmortyapi.com/api/character/${selectedId}`
        );
        setCharacter(data);

        const episodesId = data.episode.map((e) => e.split("/").at(-1));
        const { data: episodeData } = await axios.get(
          `https://rickandmortyapi.com/api/episode/${episodesId}`
        );
        setEpisodes([episodeData].flat().slice(0, 5));
      } catch (error) {
        toast.error(error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    }
    if (selectedId) fetchData();
  }, [selectedId]);
  if (isLoading)
    return (
      <div style={{ flex: 1 }}>
        <Loader />
      </div>
    );
  if (!character || !selectedId)
    return (
      <div style={{ flex: 1, color: "var(--slate-300)" }}>
        please select a character
      </div>
    );
  return (
    <div style={{ flex: 1 }}>
      <CharacterSubInfo
        character={character}
        isAddToFavourites={isAddToFavourites}
        onAddFavourite={onAddFavourite}
      />
      <EpisodeList episodes={episodes} />
    </div>
  );
}

export default CharacterDetail;

function CharacterSubInfo({ character, isAddToFavourites, onAddFavourite }) {
  return (
    <div className="character-detail">
      <img
        src={character.image}
        alt={character.name}
        className="character-detail__img"
      />
      <div className="character-detail__info">
        <h3 className="name">
          <span>{character.gender === "Male" ? "👨" : "👩‍🦳"}</span>
          <span>&nbsp;{character.name}</span>
        </h3>
        <div className="info">
          <span
            className={`status ${character.status === "Dead" ? "red" : ""}`}
          ></span>
          <span>&nbsp;{character.status}</span>
          <span> - &nbsp;{character.species}</span>
        </div>
        <div className="location">
          <p>Last Know Location :</p>
          <p>{character.location.name}</p>
        </div>
        <div className="actions">
          {isAddToFavourites ? (
            <p>Already Added To Favourites ✅</p>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => onAddFavourite(character)}
            >
              Add to Favourite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EpisodeList({ episodes }) {
  const [sortBy, setSortBy] = useState(true);
  let sortEpisodes;
  if (sortBy) {
    sortEpisodes = [...episodes].sort(
      (a, b) => new Date(a.created) - new Date(b.created)
    );
  } else {
    sortEpisodes = [...episodes].sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
  }
  return (
    <div className="character-episodes">
      <div className="title">
        <h2>List of Episodes :</h2>
        <button
          onClick={() => {
            setSortBy((is) => !is);
          }}
        >
          <ArrowUpCircleIcon
            className="icon"
            style={{ rotate: sortBy ? "0deg" : "180deg" }}
          />
        </button>
      </div>
      <ul>
        {sortEpisodes.map((item, index) => (
          <li key={item.id}>
            <div>
              {String(index + 1).padStart(2, "0")} - {item.episode} :{" "}
              <strong>{item.name}</strong>
            </div>
            <div className="badge badge--secondary">{item.air_date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
