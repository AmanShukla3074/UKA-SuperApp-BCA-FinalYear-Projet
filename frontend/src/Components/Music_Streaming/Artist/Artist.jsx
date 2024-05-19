import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Artist.css";
import { Link, useParams } from "react-router-dom";
import MusicItem from "../MusicItem/MusicItem";

const Artist = ({ match }) => {
  const [artist, setArtist] = useState({});
  const [albums, setAlbums] = useState([]);
  const [music, setMusic] = useState([]);
  const { artistId } = useParams();
  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Music/artist-search/${artistId}/`
        );
        setArtist(response.data.artist);
        setAlbums(response.data.albums);
        setMusic(response.data.music);
      } catch (error) {
        console.error("Failed to fetch artist data:", error);
      }
    };

    fetchArtistData();
  }, [artistId]);

  return (
    <div className="artist-page">
      <div className="artist-detail-main">
        <div className="artist-detail-img">
          <img
            src={`http://127.0.0.1:8000${artist.Artist_Profile_Picture}`}
            alt={artist.Artist_Name}
          />
        </div>
        <div className="artist-detail-info">
          <h1 className="album-details-title">{artist.Artist_Name}</h1>
          <p>{artist.Bio}</p>
        </div>
      </div>

      {albums.length > 0 && (
          <>
            <h2 className="searchMusicHeader">Albums</h2>
            <div className="searchAlbumWrapper">
            {/* {albums.map((album, index) => (
              <div key={index} className="albumItems">
                <Link to={`/musicstreaming/album/${album.Album_ID}`}>
                <div className="album-img-container">
                  <img className="music-img" src={`http://127.0.0.1:8000/${album.cover}`} />
                </div>
                </Link>
                <h3>{album.Album_Title}</h3>
              </div>
            ))} */}
             {albums.map((album, index) => (
              album.Music.length > 0 && ( // Check if the album has music
                <div key={index} className="albumItems">
                 <Link to={`/musicstreaming/album/${album.Album_ID}`}>
                    <div className="album-img-container">
                      <img className="music-img" src={`http://127.0.0.1:8000/${album.cover}`} />
                    </div>
                 </Link>
                 <h3>{album.Album_Title}</h3>
                </div>
              )
            ))}
            </div>
          </>
        )}
     
      <h2>Music</h2>
     
      <div className="musicContainer">
        {music.map((item) => (
          <MusicItem
          key={item.Music_ID}
          id={item.Music_ID}
          name={item.Music_Title}
          image={`http://127.0.0.1:8000${item.cover}`}
          artist={item.Artist}
          item={item}
        />
        ))}
      </div>
    </div>
  );
};

export default Artist;
