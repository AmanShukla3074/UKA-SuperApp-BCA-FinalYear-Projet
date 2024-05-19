import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MovieDetails.css";
import Movie_Item from "../Movie_Item/Movie_Item";
import { BookingPopUp } from "../..";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [data, setData] = useState({});
  const [recomendationmovie, setRecomendationmovie] = useState([]);
  const [showtimeData, setShowtimeData] = useState([]);
  const [isLoadingShowtime, setIsLoadingShowtime] = useState(false);
  const [sortedData, setSortedData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [movieRatings, setMovieRatings] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/movies/${movieId}/`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchData();
  }, [movieId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/movies/`
        );
        setRecomendationmovie(response.data);
      } catch (error) {
        console.error("Error fetching recommended movies data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchShowtimeData = async () => {
    try {
      setIsLoadingShowtime(true);
      const response = await axios.get(
        `http://127.0.0.1:8000/api/Movie/showtimes?movie=${movieId}`
      );
      setShowtimeData(response.data);

      const showtimeData = response.data;

      const groupedByLanguage = showtimeData.reduce((result, showtime) => {
        const languageID = showtime.M_Language.Language_ID;
        if (!result[languageID]) {
          result[languageID] = [];
        }
        result[languageID].push(showtime);
        return result;
      }, {});

      const sortedData = {};
      for (const languageID in groupedByLanguage) {
        const languageGroup = groupedByLanguage[languageID];
        const groupedByShowType = languageGroup.reduce((result, showtime) => {
          const typeID = showtime.M_Type.Type_ID;
          if (!result[typeID]) {
            result[typeID] = [];
          }
          result[typeID].push(showtime);
          return result;
        }, {});
        sortedData[languageID] = groupedByShowType;
      }

      setSortedData(sortedData);
      
    } catch (error) {
      console.error("Error fetching showtime data:", error);
    } finally {
      setIsLoadingShowtime(false);
    }
  };

  const navigateToAnotherRoute = () => {
    if (showtimeData.length === 0 && !isLoadingShowtime) {
      fetchShowtimeData();
    }

    setShowModal(true);
  };

  const baseUrl = "http://127.0.0.1:8000";
  const firstImage =
    data.images && data.images.length > 0
      ? `${baseUrl}${data.images[0].img}`
      : "";

  const genres =
    data.genre && data.genre.map((genre) => genre.Genre_ID.Genre_Name);
  const language =
    data.language &&
    data.language.map((genre) => genre.Language_ID.Language_Name);
  const type = data.type && data.type.map((genre) => genre.Type_ID.Type_Name);

  const cast = data.cast;
  const director = data.director;
  const producer = data.producer;

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Movie/rate_movie_get?M_ID=${movieId}`
        );
        const ratings = response.data.average_rating;
        if (ratings > 0) {
          setMovieRatings(ratings); // Only set the ratings if it's greater than 0
        }
      } catch (error) {
        console.error("Error fetching movie ratings:", error);
      }
    };

    if (movieId) {
      fetchRatings();
    }
 }, [movieId]);



  return (
    <>
      <div className="movie-container">
        <div className="movie-details-container">
          <div className="img">
            <img src={firstImage} alt={firstImage} className="movie-poster" />
          </div>
          <div className="movie-info">
            <h1 className="movie-title">
              {/* {data.M_Name} */}
              {data.M_Name} <span className="movieRatings"> {movieRatings && `(Ratings: ${movieRatings}/10)`}</span>
            </h1>
            <p className="movie-duration">Duration : {data.M_Duration}</p>
            <p className="movie-release-date">
              Release Date : {data.M_ReleaseDate}
            </p>
            <div className="movie-genre">
              <div className="genres">
                {" "}
                Genres :
                {genres &&
                  genres.map((genre, index) => (
                    <span className="genre" key={index}>
                      {genre}{" "}
                    </span>
                  ))}
              </div>
            </div>
            <div className="movie-language">
              <div className="languages">
                {" "}
                Languages :
                {genres &&
                  language.map((language, index) => (
                    <span className="genre" key={index}>
                      {language}
                      {"  "}
                    </span>
                  ))}
              </div>
            </div>
            <div className="movie-type">
              <div className="type">
                {" "}
                Type :
                {genres &&
                  type.map((type, index) => (
                    <span className="genre" key={index}>
                      {type}
                      {"  "}
                    </span>
                  ))}
              </div>
            </div>
            <p className="movie-certification">
              Age Certification: {data.M_Age_Certification}
            </p>

            <button className="book-button"
              onClick={navigateToAnotherRoute}
              disabled={isLoadingShowtime}
            >
              {isLoadingShowtime ? "Loading..." : "BOOK TICKETS"}
            </button>
            <BookingPopUp show={showModal} onClose={handleCloseModal} movieId={movieId} sortedData={sortedData}>
              {Object.entries(sortedData).map(([languageID, languageGroup]) => (
                <div key={languageID} className="modal-language">
                  <h3>
                    {languageGroup[0]?.[0]?.M_Language?.Language_Name ||
                      languageGroup[1]?.[0]?.M_Language?.Language_Name}
                  </h3>
                  <ul>
                    {Object.entries(languageGroup).map(
                      ([typeID, showTypeGroup]) => (
                        <div key={typeID} className="modal-showtype">
                          <h4>
                            {/* Show Type:{" "} */}
                            {showTypeGroup[0] &&
                              showTypeGroup[0].M_Type &&
                              showTypeGroup[0].M_Type.Type_Name}
                          </h4>
                        </div>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </BookingPopUp>
          </div>
          <p className="movie-description">
              Synopsis: <br />
              {data.M_Synopsis}
            </p>
        </div>
      </div>

      <div className="castAndCrew">
        <h1>Cast and crew</h1>

        <h2>Cast</h2>
        <div className="cast-container">
          <div className="cast-scroll-container">
            {cast &&
              cast.map((castMember) => (
                <div className="cast-card" key={castMember.MCast_ID}>
                  <div className="img">
                    <img
                      src={`http://127.0.0.1:8000${castMember.Cast_ID.Cast_img}`}
                      alt={castMember.Cast_ID.Cast_Name}
                    />
                  </div>
                  <div className="cast-details">
                    <h3>{castMember.Cast_ID.Cast_Name}</h3>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <h2>Directors - Producers</h2>
        <div className="cast-container">
          <div className="cast-scroll-container">
            {director &&
              director.map((castMember) => (
                <div className="cast-card" key={castMember.Md_ID}>
                  <div className="img">
                    <img
                      src={`http://127.0.0.1:8000${castMember.Director_ID.Director_img}`}
                      alt={`${castMember.Director_ID.Director_Name}`}
                    />
                  </div>
                  <div className="cast-details">
                    <h3>{castMember.Director_ID.Director_Name}</h3>
                    <p>Director</p>
                  </div>
                </div>
              ))}
            {producer &&
              producer.map((castMember) => (
                <div className="cast-card" key={castMember.Mp_ID}>
                  <div className="img">
                    <img
                      src={`http://127.0.0.1:8000${castMember.Producer_ID.Producer_img}`}
                      alt={`${castMember.Producer_ID.Producer_Name}`}
                    />
                  </div>
                  <div className="cast-details">
                    <h3>{castMember.Producer_ID.Producer_Name}</h3>
                    <p>Producer</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="recomendationmovie">
        <h1>Movies</h1>
        <div className="container">
          {recomendationmovie.slice(0, 4).map((item) => (
            <div
              key={item.M_ID}
              onClick={() => window.open(`${item.M_ID}`, "_blank")}
            >
              <Movie_Item
                id={item.M_ID}
                name={item.M_Name}
                images={item.images}
                genre={item.genre}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
