import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../../Context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyAlbum.css";
const MyAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const { authTokens } = useContext(AuthContext);
  console.log("State in MyAlbum:", { showDeleteButton: true });

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/Music/album/",
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        setAlbums(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [authTokens]);


  
//  const deleteAlbum = async (id) => {
//   try {
//     await axios.delete(`http://127.0.0.1:8000/api/Music/album/${id}/`, {
//       headers: {
//         Authorization: `Bearer ${authTokens.access}`,
//       },
//     });
//     // // Remove the deleted item from the local state
//     // setMusicData(musicData.filter(item => item.Music_ID !== id));
//   } catch (error) {
//     console.error('Error deleting music:', error);
//   }
// };

  return (
    <div>
      {albums.length > 0 && (
        <>
          <h2 className="MyAlbumHeader">Albums</h2>
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
            {albums.map(
              (album, index) =>
                album.Music.length > 0 && ( // Check if the album has music
                  <div key={index} className="albumItems">
                    <Link to={`/musicstreaming/album/${album.Album_ID}`}>
                      <div className="album-img-container">
                        <img
                          className="music-img"
                          src={`http://127.0.0.1:8000/${album.cover}`}
                        />
                      </div>
                    </Link>
                    <h3>{album.Album_Title}</h3>
                  </div>
                )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyAlbum;
