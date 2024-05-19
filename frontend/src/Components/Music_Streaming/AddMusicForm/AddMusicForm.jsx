import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./AddMusicForm.css";
import AuthContext from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddMusicForm = () => {
  const [formData, setFormData] = useState({
    Music_Title: "",
    Copyrightowner: "",
    MS_Genre_ID: "",
    Album_ID: "",
    file: null,
    cover: null, // Add this line for the cover image
  });

  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate()
  const [genres, setGenres] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/Music/genre/"
        );
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/Music/album/",
          {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          }
        );
        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchGenres();
    fetchAlbums();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const uploadMusic = async () => {
  //   try {
  //     // Create a new FormData instance with a different name to avoid conflict
  //     const uploadFormData = new FormData();

  //     if (
  //       !formData.Music_Title ||
  //       !formData.Copyrightowner ||
  //       !formData.MS_Genre_ID ||
  //       !formData.Album_ID ||
  //       !formData.file ||
  //       !formData.cover
  //     ) {
  //       console.error("Required fields are missing or invalid.");
  //       return;
  //     }

  //     uploadFormData.append("Music_Title", formData.Music_Title);
  //     uploadFormData.append("Copyrightowner", formData.Copyrightowner);
  //     uploadFormData.append("MS_Genre_ID", formData.MS_Genre_ID);
  //     uploadFormData.append("Album_ID", formData.Album_ID);
  //     uploadFormData.append("file", formData.file);
  //     uploadFormData.append("cover", formData.cover);

  //       //  // Correctly access the file from the formData state
  //       //  if (formData.file) {
  //       //    uploadFormData.append("file", formData.file);
  //       //  } else {
  //       //    console.warn("No music file selected");
  //       //  }

  //     // Log the data being sent
  //     for (let [key, value] of uploadFormData.entries()) {
  //       console.log(`${key}: ${value}`);
  //     }

  //     const response = await axios.post(
  //       "http://127.0.0.1:8000/api/Music/music/",
  //       uploadFormData, // Use the renamed FormData instance here
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authTokens?.access}`,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     // Check for successful response and handle data
  //     if (response && response.data) {
  //       console.log("Music uploaded successfully:", response.data);
  //       navigate('/musicstreaming')
  //       // Handle successful upload (e.g., clear form, show success message)
  //     } else {
  //       console.error("Unexpected response format:", response);
  //     }
  //   } catch (error) {
  //     // Handle errors appropriately (e.g., display error message to user)
  //     if (error.response && error.response.data) {
  //       console.error("Error uploading music:", error.response.data);
  //     } else {
  //       console.error("An unexpected error occurred:", error);
  //     }
  //   }
  // };

  const uploadMusic = async () => {
    try {
       const uploadFormData = new FormData();
   
       if (
         !formData.Music_Title ||
         !formData.Copyrightowner ||
         !formData.MS_Genre_ID ||
         !formData.file ||
         !formData.cover
       ) {
         console.error("Required fields are missing or invalid.");
         return;
       }
   
       uploadFormData.append("Music_Title", formData.Music_Title);
       uploadFormData.append("Copyrightowner", formData.Copyrightowner);
       uploadFormData.append("MS_Genre_ID", formData.MS_Genre_ID);
       // Only append Album_ID if it's not an empty string
       if (formData.Album_ID !== "") {
         uploadFormData.append("Album_ID", formData.Album_ID);
       }
       uploadFormData.append("file", formData.file);
       uploadFormData.append("cover", formData.cover);
   
       for (let [key, value] of uploadFormData.entries()) {
         console.log(`${key}: ${value}`);
       }
   
       const response = await axios.post(
         "http://127.0.0.1:8000/api/Music/music/",
         uploadFormData,
         {
           headers: {
             Authorization: `Bearer ${authTokens?.access}`,
             "Content-Type": "multipart/form-data",
           },
         }
       );
   
       if (response && response.data) {
         console.log("Music uploaded successfully:", response.data);
         navigate('/musicstreaming')
       } else {
         console.error("Unexpected response format:", response);
       }
    } catch (error) {
       if (error.response && error.response.data) {
         console.error("Error uploading music:", error.response.data);
       } else {
         console.error("An unexpected error occurred:", error);
       }
    }
   };
   

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadMusic();
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label htmlFor="Music_Title">Music Title:</label>
      <input
        type="text"
        id="Music_Title"
        name="Music_Title"
        value={formData.Music_Title}
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

      <label htmlFor="Album_ID">Album:</label>
      <select
        id="Album_ID"
        name="Album_ID"
        value={formData.Album_ID}
        onChange={handleChange}
        // required
      >
        <option value="">Select an album</option>
        {albums.map((album) => (
          <option key={album.Album_ID} value={album.Album_ID}>
            {album.Album_Title}
          </option>
        ))}
      </select>
      
      <label htmlFor="file">Music File:</label>
      <input
        type="file"
        id="file"
        name="file"
        onChange={handleFileChange}
        required
      />
      <label htmlFor="cover">Cover Image:</label>
      <input
        type="file"
        id="cover"
        name="cover"
        onChange={(e) => setFormData({ ...formData, cover: e.target.files[0] })}
        // required
      />
      <button type="submit">Upload Music</button>
    </form>
  );
};

export default AddMusicForm;
// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import "./AddMusicForm.css";
// import AuthContext from "../../../Context/AuthContext";

// const AddMusicForm = () => {
//     const [formData, setFormData] = useState({
//         Music_Title: "",
//         Copyrightowner: "",
//         MS_Genre_ID: "",
//         Album_ID: "",
//         file: null,
//     });

//  const { authTokens } = useContext(AuthContext);

//  const [genres, setGenres] = useState([]);
//  const [albums, setAlbums] = useState([]);

//  useEffect(() => {
//     const fetchGenres = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/Music/genre/"
//         );
//         setGenres(response.data);
//       } catch (error) {
//         console.error("Error fetching genres:", error);
//       }
//     };

//     const fetchAlbums = async () => {
//       try {
//         const response = await axios.get(
//           "http://127.0.0.1:8000/api/Music/album/",
//           {
//             headers: {
//               Authorization: `Bearer ${authTokens.access}`,
//             },
//           }
//         );
//         setAlbums(response.data);
//       } catch (error) {
//         console.error("Error fetching albums:", error);
//       }
//     };

//     fetchGenres();
//     fetchAlbums();
//  }, []);

//  const handleFileChange = (e) => {
//     setFormData({ ...formData, file: e.target.files[0] });
//  };

//  const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//  };

//  const uploadMusic = async () => {
//     try {
//        // Create a new FormData instance with a different name to avoid conflict
//        const uploadFormData = new FormData();

//        if (!formData.Music_Title || !formData.Copyrightowner || !formData.MS_Genre_ID || !formData.Album_ID || !formData.file) {
//         console.error("Required fields are missing or invalid.");
//         return;
//       }

//       uploadFormData.append("Music_Title", formData.Music_Title);
//       uploadFormData.append("Copyrightowner", formData.Copyrightowner);
//       uploadFormData.append("MS_Genre_ID", formData.MS_Genre_ID);
//       uploadFormData.append("Album_ID", formData.Album_ID);

//        // Correctly access the file from the formData state
//        if (formData.file) {
//          uploadFormData.append("file", formData.file);
//        } else {
//          console.warn("No music file selected");
//        }

//        // Log the data being sent
//        for (let [key, value] of uploadFormData.entries()) {
//          console.log(`${key}: ${value}`);
//        }

//        const response = await axios.post(
//          "http://127.0.0.1:8000/api/Music/music/",
//          uploadFormData, // Use the renamed FormData instance here
//          {
//            headers: {
//              Authorization: `Bearer ${authTokens?.access}`,
//              "Content-Type": "multipart/form-data",
//            },
//          }
//        );

//        // Check for successful response and handle data
//        if (response && response.data) {
//          console.log("Music uploaded successfully:", response.data);
//          // Handle successful upload (e.g., clear form, show success message)
//        } else {
//          console.error("Unexpected response format:", response);
//        }
//     } catch (error) {
//        // Handle errors appropriately (e.g., display error message to user)
//        if (error.response && error.response.data) {
//          console.error("Error uploading music:", error.response.data);
//        } else {
//          console.error("An unexpected error occurred:", error);
//        }
//     }
// };

//  const handleSubmit = (e) => {
//     e.preventDefault();
//     uploadMusic();
//  };

//  return (
//     <form onSubmit={handleSubmit} className="upload-form">
//       <label htmlFor="Music_Title">Music Title:</label>
//       <input
//         type="text"
//         id="Music_Title"
//         name="Music_Title"
//         value={formData.Music_Title}
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

//       <label htmlFor="Album_ID">Album:</label>
//       <select
//         id="Album_ID"
//         name="Album_ID"
//         value={formData.Album_ID}
//         onChange={handleChange}
//         required
//       >
//         <option value="">Select an album</option>
//         {albums.map((album) => (
//           <option key={album.Album_ID} value={album.Album_ID}>
//             {album.Album_Title}
//           </option>
//         ))}
//       </select>
//       <label htmlFor="file">Music File:</label>
//       <input
//         type="file"
//         id="file"
//         name="file"
//         onChange={handleFileChange}
//         // required
//       />
//       <button type="submit">Upload Music</button>
//     </form>
//  );
// };

// export default AddMusicForm;
