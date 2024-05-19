// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import AuthContext from "../../../Context/AuthContext";
// import MusicItem from "../MusicItem/MusicItem";
// import "./Playlist.css";
// import songContext from "../../../Context/songContext";
// import { FaTrash } from "react-icons/fa";

// const Playlist = () => {
//   const { playlistId } = useParams();
//   const { authTokens } = useContext(AuthContext);
  
//   const [playlistData, setPlaylistData] = useState(null);

//   const { setPlaylist } = useContext(songContext);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPlaylist = async () => {
//       try {
//         const response = await axios.get(
//           `http://127.0.0.1:8000/api/Music/playlist/${playlistId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${authTokens?.access}`,
//             },
//           }
//         );
//         console.log(response.data);
//         if (response.status === 200) {
//           const transformedData = response.data.PlaylistMusic.map((item) => ({
//             Music_ID: item.Music_ID.Music_ID,
//             PlaylistMusic_ID: item.PlaylistMusic_ID,
//             Music_Title: item.Music_ID.Music_Title,
//             Release_Date: item.Music_ID.Release_Date,
//             MS_Genre_ID: item.Music_ID.MS_Genre_ID,
//             Album_ID: item.Music_ID.Album_ID,
//             Copyrightowner: item.Music_ID.Copyrightowner,
//             file: item.Music_ID.file,
//             cover: item.Music_ID.cover,
//             M_Streams: item.Music_ID.M_Streams,
//             Artist: item.Music_ID.Artist,
//           }));

//           setPlaylistData({
//             Playlist_Title: response.data.Playlist_Title,
//             PlaylistMusic: transformedData,
//           });

//           setPlaylist(transformedData);
//         } else {
//           throw new Error("Failed to fetch playlist data");
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };

//     fetchPlaylist();
//   }, [playlistId, authTokens]);

//   const deletePlaylist = async () => {
//     try {
//       await axios.delete(
//         `http://127.0.0.1:8000/api/Music/playlist/${playlistId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${authTokens?.access}`,
//           },
//         }
//       );
//       navigate("/musicstreaming");
//     } catch (error) {
//       console.error("Error deleting playlist:", error);
//     }
//   };

//   const deleteMusicFromPlaylist = async (musicId) => {
//     try {
//        await axios.delete(
//          `http://127.0.0.1:8000/api/Music/playlist-Music/${musicId}/`,
//          {
//            headers: {
//              Authorization: `Bearer ${authTokens?.access}`,
//            },
//          }
//        );
//        // Handle successful deletion (e.g., remove the music item from the state)
//        setPlaylistData((prevData) => ({
//          ...prevData,
//          PlaylistMusic: prevData.PlaylistMusic.filter(item => item.Music_ID !== musicId),
//        }));
//     } catch (error) {
//        console.error("Error deleting music from playlist:", error);
//     }
//    };
   

//   return (
//     <div>
//       {playlistData && (
//         <div>
//           <div className="PlaylistWarpper">
//             <div className="">
              
//             <h2 className="playlist-title">
//               {playlistData.Playlist_Title}
//             </h2>
//             </div>
//             <div className="">

//               <button onClick={deletePlaylist} className="myMusicDeleteBtn">
//                 <FaTrash />
//               </button>
//             </div>
//           </div>
//           <div className="musicContainer">
//             {playlistData.PlaylistMusic.slice(0, 20).map((item) => (
//               <div key={item.Music_ID} className='myMusicItem'>
//               <MusicItem
//                 id={item.Music_ID}
//                 name={item.Music_Title}
//                 image={item.cover}
//                 artist={item.Artist}
//                 item={item}
//               />
//               <div className="myMusicItemBtns">
//               <button className='myMusicDeleteBtn' onClick={() => deleteMusicFromPlaylist(item.PlaylistMusic_ID)}><FaTrash/></button>
//               </div>
//             </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );

 
// };

// export default Playlist;

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../../Context/AuthContext";
import MusicItem from "../MusicItem/MusicItem";
import "./Playlist.css";
import songContext from "../../../Context/songContext";
import { FaTrash } from "react-icons/fa";

const Playlist = () => {
  const { playlistId } = useParams();
  const { authTokens } = useContext(AuthContext);
  
  const [playlistData, setPlaylistData] = useState(null);

  const { setPlaylist } = useContext(songContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Music/playlist/${playlistId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        console.log(response.data);
        if (response.status === 200) {
          const transformedData = response.data.PlaylistMusic.map((item) => ({
            Music_ID: item.Music_ID.Music_ID,
            PlaylistMusic_ID: item.PlaylistMusic_ID,
            Music_Title: item.Music_ID.Music_Title,
            Release_Date: item.Music_ID.Release_Date,
            MS_Genre_ID: item.Music_ID.MS_Genre_ID,
            Album_ID: item.Music_ID.Album_ID,
            Copyrightowner: item.Music_ID.Copyrightowner,
            file: item.Music_ID.file,
            cover: item.Music_ID.cover,
            M_Streams: item.Music_ID.M_Streams,
            Artist: item.Music_ID.Artist,
          }));

          setPlaylistData({
            Playlist_Title: response.data.Playlist_Title,
            PlaylistMusic: transformedData,
          });

          setPlaylist(transformedData);
        } else {
          throw new Error("Failed to fetch playlist data");
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPlaylist();
  }, [playlistId, authTokens]);

  const deletePlaylist = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/Music/playlist/${playlistId}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );
      navigate("/musicstreaming");
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const deleteMusicFromPlaylist = async (musicId) => {
    try {
       await axios.delete(
         `http://127.0.0.1:8000/api/Music/playlist-Music/${musicId}/`,
         {
           headers: {
             Authorization: `Bearer ${authTokens?.access}`,
           },
         }
       );

       // Filter out the deleted music item from the playlist data
       const updatedPlaylist = playlistData.PlaylistMusic.filter(item => item.PlaylistMusic_ID !== musicId);
       setPlaylistData(prevData => ({
         ...prevData,
         PlaylistMusic: updatedPlaylist,
       }));
    } catch (error) {
       console.error("Error deleting music from playlist:", error);
    }
   };

  return (
    <div>
      {playlistData && (
        <div>
          <div className="PlaylistWarpper">
            <div className="">
              
            <h2 className="playlist-title">
              {playlistData.Playlist_Title}
            </h2>
            </div>
            <div className="">

              <button onClick={deletePlaylist} className="myMusicDeleteBtn">
                <FaTrash />
              </button>
            </div>
          </div>
          <div className="musicContainer">
            {playlistData.PlaylistMusic.slice(0, 20).map((item) => (
              <div key={item.PlaylistMusic_ID} className='myMusicItem'>
              <MusicItem
                id={item.Music_ID}
                name={item.Music_Title}
                image={item.cover}
                artist={item.Artist}
                item={item}
              />
              <div className="myMusicItemBtns">
              <button className='myMusicDeleteBtn' onClick={() => deleteMusicFromPlaylist(item.PlaylistMusic_ID)}><FaTrash/></button>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;
