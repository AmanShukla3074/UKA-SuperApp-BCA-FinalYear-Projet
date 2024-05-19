import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./ArtistRegiForm.css";
import AuthContext from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const ArtistRegiForm = () => {
  const [formData, setFormData] = useState({
    Bio: "",
    Artist_Name: "",
    MS_Genre_ID: "",
    Artist_Profile_Picture: null,
  });

  const { authTokens } = useContext(AuthContext);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
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

    fetchGenres();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, Artist_Profile_Picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataCopy = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataCopy.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Music/artist/",
        formDataCopy,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      console.log(response.data);
      navigate("/musicstreaming")
      // Handle success (e.g., show a success message, redirect)
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="artistregiForm">
      <form className="artistregiFormMain" onSubmit={handleSubmit}>
        <label>
          Artist Name:
          <input
            type="text"
            name="Artist_Name"
            value={formData.Artist_Name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Bio: <br/>
          <textarea
            name="Bio"
            value={formData.Bio}
            onChange={handleChange}
            required
            className="ArtistRegiBio"
          />
        </label>
        <label>
          Genre ID:
          <select
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
        </label>
        <label>
          Profile Picture:
          <input
            type="file"
            name="Artist_Profile_Picture"
            onChange={handleFileChange}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default ArtistRegiForm;
