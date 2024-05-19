
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import './AddToPlaylistModal.css'; // Import the CSS file
import AuthContext from '../../../../Context/AuthContext'; // Adjust the import path as necessary

const AddToPlaylistModal = ({ closeModal , addSongToPlaylist}) => {
    const [data, setData] = useState([]);
    const { authTokens } = useContext(AuthContext); // Accessing authTokens from AuthContext
   
    useEffect(() => {
       const fetchData = async () => {
         try {
           const response = await axios.get('http://127.0.0.1:8000/api/Music/playlist/', {
             headers: {
               Authorization: `Bearer ${authTokens?.access}`, // Including JWT token in the request headers
             },
           });
           setData(response.data);
           console.log(response.data);
         } catch (error) {
           console.error('Error fetching data:', error);
         }
       };
   
       fetchData();
    }, [authTokens]); // Adding authTokens as a dependency to re-fetch data when it changes
   console.log(data)

 return (
    <div className="add-modal-background" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          Select Playlist
        </div>
        {/* <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="input-field"
          /> 
          <button type="submit" className="create-button">Create</button>
        </form> */}
              <div className="playlistcontainer">
        {data.map((item) => (
          <PlaylistItemModal
            key={item.Playlist_ID}
            Playlistid={item.Playlist_ID}
            PlaylistName={item.Playlist_Title}
            addSongToPlaylist={addSongToPlaylist}
                      />
        ))}
      </div>
      </div>
    </div>
 );
};

const PlaylistItemModal = ({ Playlistid, PlaylistName ,addSongToPlaylist}) => {
    return (
    
        // <Link to={`/musicstreaming/playlist/${Playlistid}`} className="movie-link"> 
        <div className="playlistCard" onClick={()=>{addSongToPlaylist(Playlistid)}}>
          <h1 className="playlistTitle">{PlaylistName}</h1>
        </div>
  
    //   </Link>
   
    );
  };


export default AddToPlaylistModal;
