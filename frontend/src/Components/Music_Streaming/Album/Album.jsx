import React, { useState, useEffect } from "react";
import MusicItem from "../MusicItem/MusicItem";
import {  useParams } from "react-router-dom";
import "./Album.css";

const Album = () => {
  const [album, setAlbum] = useState({});
  const { albumId } = useParams();
 
 
  useEffect(() => {
    const fetchAlbum = async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/api/Music/album/${albumId}/`
      );
      const data = await response.json();
      setAlbum(data);
    };

    fetchAlbum();
  }, [albumId]);

  // Function to display artist names
  const displayArtists = () => {
    if (album.Artist && album.Artist.length > 0) {
      return album.Artist.map((artist, index) => (
        <span key={artist.Artist_ID}>
          {artist.Artist_Name}
          {index < album.Artist.length - 1 ? ", " : ""}
        </span>
      ));
    }
    return "Unknown Artist";
  };

  return (
    <div className="album-page">
      <div className="album-details-main">
        <div className="album-detail-img">
          <img
            src={`http://127.0.0.1:8000${album.cover}`}
            alt={album.Album_Title}
          />
        </div>
        <div className="album-details-info">
          <h1 className="album-details-title">{album.Album_Title}</h1>
          <p>No. of Songs: {album.Music ? album.Music.length : 0}</p>
          <p>Artist: {displayArtists()}</p>
        </div>
      </div>
      <div className="musicContainer">
        {album.Music &&
          album.Music.map((item) => (
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

export default Album;

// import React, { useState, useEffect } from 'react';
// import MusicItem from '../MusicItem/MusicItem';
// import { useParams } from 'react-router-dom';
// import './Album.css';

// const Album = ({ match }) => {
//  const [album, setAlbum] = useState({});
//   const {albumId} = useParams();
//   // alert(albumId)
//  useEffect(() => {
//     const fetchAlbum = async () => {
//       const response = await fetch(`http://127.0.0.1:8000/api/Music/album/${albumId}/`);
//       const data = await response.json();
//       setAlbum(data);
//     };

//     fetchAlbum();
//  }, [albumId]);

//  return (
//     <div className="album-page">
//       <h1>{album.Album_Title}</h1>
//       <img src={`http://127.0.0.1:8000${album.cover}`} alt={album.Album_Title} />
//       <p>No. of Songs: {album.No_Of_Songs}</p>
//       <div className="musicContainer">
//         {album.Music && album.Music.map(item => (
//           <MusicItem
//             key={item.Music_ID}
//             id={item.Music_ID}
//             name={item.Music_Title}
//             image={`http://127.0.0.1:8000${item.cover}`}
//             artist={item.Artist}
//             // artist={item.Artist && item.Artist.map(artist => artist.Artist_Name).join(', ')}
//             item={item}
//           />
//         ))}
//       </div>
//     </div>
//  );
// };

// export default Album;
