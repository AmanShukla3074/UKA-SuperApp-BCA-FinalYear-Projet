import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./AddAlbumForm.css"; // Ensure you have a CSS file for styling
import AuthContext from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddAlbumForm = () => {
 const [formData, setFormData] = useState({
    Album_Title: "",
    Copyrightowner: "",
    MS_Genre_ID: "",
    cover: null, // Add this line for the cover image
 });

 const { authTokens } = useContext(AuthContext);
 const navigate = useNavigate();
 const [genres, setGenres] = useState([]);

 useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/Music/genre/");
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
 }, []);

 const handleFileChange = (e) => {
    setFormData({ ...formData, cover: e.target.files[0] });
 };

 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const uploadAlbum = async () => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("Album_Title", formData.Album_Title);
      uploadFormData.append("Copyrightowner", formData.Copyrightowner);
      uploadFormData.append("MS_Genre_ID", formData.MS_Genre_ID);
      uploadFormData.append("cover", formData.cover); // Append the cover image

      const response = await axios.post(
        "http://127.0.0.1:8000/api/Music/album/",
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data) {
        console.log("Album uploaded successfully:", response.data);
        navigate('/musicstreaming/add-music');
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error uploading album:", error.response.data);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
 };

 const handleSubmit = (e) => {
    e.preventDefault();
    uploadAlbum();
 };

 return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label htmlFor="Album_Title">Album Title:</label>
      <input
        type="text"
        id="Album_Title"
        name="Album_Title"
        value={formData.Album_Title}
        onChange={handleChange}
        required
      />

      <label htmlFor="Copyrightowner">Copyright Owner:</label>
      <input
        type="text"
        id="Copyrightowner"
        name="Copyrightowner"
        value={formData.Copyrightowner}
        onChange={handleChange}
        required
      />

      <label htmlFor="MS_Genre_ID">Genre:</label>
      <select
        id="MS_Genre_ID"
        name="MS_Genre_ID"
        value={formData.MS_Genre_ID}
        onChange={handleChange}
        required
      >
        <option value="">Select a genre</option>
        {genres.map((genre) => (
          <option key={genre.MS_Genre_ID} value={genre.MS_Genre_ID}>
            {genre.Genre_Name}
          </option>
        ))}
      </select>

      <label htmlFor="cover">Cover Image:</label>
      <input
        type="file"
        id="cover"
        name="cover"
        onChange={handleFileChange}
        required
      />

      <button type="submit">Upload Album</button>
    </form>
 );
};

export default AddAlbumForm;


// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import "./AddAlbumForm.css"; // Ensure you have a CSS file for styling
// import AuthContext from "../../../Context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const AddAlbumForm = () => {
//  const [formData, setFormData] = useState({
//     Album_Title: "",
//     Copyrightowner: "",
//     MS_Genre_ID: "",
//  });

//  const { authTokens } = useContext(AuthContext);

//  const [genres, setGenres] = useState([]);
//  const navigate = useNavigate()
//  useEffect(() => {
//     const fetchGenres = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/Music/genre/");
//         setGenres(response.data);
//       } catch (error) {
//         console.error("Error fetching genres:", error);
//       }
//     };

//     fetchGenres();
//  }, []);

//  const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//  };

//  const uploadAlbum = async () => {
//     try {
//       const response = await axios.post(
//         "http://127.0.0.1:8000/api/Music/album/",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${authTokens?.access}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response && response.data) {
//         console.log("Album uploaded successfully:", response.data);
//         navigate('/musicstreaming/add-music')
//         // Handle successful upload (e.g., clear form, show success message)
//       } else {
//         console.error("Unexpected response format:", response);
//       }
//     } catch (error) {
//       if (error.response && error.response.data) {
//         console.error("Error uploading album:", error.response.data);
//       } else {
//         console.error("An unexpected error occurred:", error);
//       }
//     }
//  };

//  const handleSubmit = (e) => {
//     e.preventDefault();
//     uploadAlbum();
//  };

//  return (
//     <form onSubmit={handleSubmit} className="upload-form">
//       <label htmlFor="Album_Title">Album Title:</label>
//       <input
//         type="text"
//         id="Album_Title"
//         name="Album_Title"
//         value={formData.Album_Title}
//         onChange={handleChange}
//         required
//       />

//       <label htmlFor="Copyrightowner">Copyright Owner:</label>
//       <input
//         type="text"
//         id="Copyrightowner"
//         name="Copyrightowner"
//         value={formData.Copyrightowner}
//         onChange={handleChange}
//         required
//       />

//       <label htmlFor="MS_Genre_ID">Genre:</label>
//       <select
//         id="MS_Genre_ID"
//         name="MS_Genre_ID"
//         value={formData.MS_Genre_ID}
//         onChange={handleChange}
//         required
//       >
//         <option value="">Select a genre</option>
//         {genres.map((genre) => (
//           <option key={genre.MS_Genre_ID} value={genre.MS_Genre_ID}>
//             {genre.Genre_Name}
//           </option>
//         ))}
//       </select>

//       <button type="submit">Upload Album</button>
//     </form>
//  );
// };

// export default AddAlbumForm;
