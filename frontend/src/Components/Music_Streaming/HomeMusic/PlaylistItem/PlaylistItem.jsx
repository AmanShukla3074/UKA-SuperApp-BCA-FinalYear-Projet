import React from "react";
import './PlaylistItem.css'
import { Link } from "react-router-dom";
const PlaylistItem = ({ Playlistid, PlaylistName }) => {
  return (
  
      <Link to={`/musicstreaming/playlist/${Playlistid}`} className="movie-link"> 
      <div className="playlistCard">
        <h1 className="playlistTitle">{PlaylistName}</h1>
      </div>

    </Link>
 
  );
};

export default PlaylistItem;
