import React, { useState, useContext } from "react";
import axios from "axios";
import './CreatePlaylistModal.css'; // Import the CSS file
import AuthContext from '../../../../Context/AuthContext'; // Adjust the import path as necessary

const CreatePlaylistModal = ({ closeModal }) => {
 const [playlistName, setPlaylistName] = useState("");
 const [playlistThumbnail, setPlaylistThumbnail] = useState("");

 // Access the authTokens from the AuthContext
 const { authTokens } = useContext(AuthContext);

 const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/Music/playlist/', {
        Playlist_Title: playlistName,
      }, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
        },
      });

      if (response.status === 201) {
        // Handle successful creation (e.g., close the modal, show a success message)
        closeModal();
      } else {
        // Handle errors (e.g., show an error message)
        console.error('Failed to create playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
 };

 return (
    <div className="modal-background" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          Create Playlist
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="create-button">Create</button>
        </form>
      </div>
    </div>
 );
};

export default CreatePlaylistModal;

// import React, { useState } from "react";
// import './CreatePlaylistModal.css';

// const CreatePlaylistModal = ({ closeModal }) => {
//  const [playlistName, setPlaylistName] = useState("");
//  const [playlistThumbnail, setPlaylistThumbnail] = useState("");


//  return (
//     <div className="modal-background" onClick={closeModal}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-title">
//           Create Playlist
//         </div>

//       </div>
//     </div>
//  );
// };

// export default CreatePlaylistModal;
