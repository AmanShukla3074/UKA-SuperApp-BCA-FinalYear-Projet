import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams , Link} from "react-router-dom";
import './TheaterDetails.css'

const TheaterDetails = () => {
 const { theaterId } = useParams();
 const [movies, setMovies] = useState([]);
 const [selectedDate, setSelectedDate] = useState(null);
 const [filteredShowtimes, setFilteredShowtimes] = useState([]);

 //  const { theaterId } = useParams();
 const [shows, setShows] = useState([]);
//  const [selectedDate, setSelectedDate] = useState(null);
//  const [filteredShows, setFilteredShows] = useState([]);
 useEffect(() => {
    const fetchShowtimes = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/api/Movie/showtimes?theater=${theaterId}`);
      const moviesData = response.data.reduce((acc, showtime) => {
        const movieId = showtime.M_ID.M_ID;
        if (!acc[movieId]) {
          acc[movieId] = {
            movie: showtime.M_ID,
            showtimes: [showtime],
          };
        } else {
          acc[movieId].showtimes.push(showtime);
        }
        return acc;
      }, {});
      setMovies(Object.values(moviesData));
    };

    fetchShowtimes();
 }, [theaterId]);

 const handleDateChange = (event, date) => {
    event && event.preventDefault();
    date && setSelectedDate(date);

    const filteredShowtimes = movies.flatMap(movie =>
      movie.showtimes.filter(showtime => new Date(showtime.Date).toISOString().split("T")[0] === date)
    );
    setFilteredShowtimes(filteredShowtimes);
 };

 return (
    <div className="theater-details">
      <div className="movie-list">
        {movies.map(movie => (
          <div key={movie.movie.M_ID} className="movie-item">
            <h3 className="movieName">{movie.movie.M_Name}</h3>
            <div className="showtimeList">
            {movie.showtimes.map(showtime => (
              <div key={showtime.ShowTime_ID} className="showtime-item-theater">
                <p>{new Date(showtime.Date).toLocaleDateString("en-GB")}</p>
                <p>{showtime.StartTime}</p>
              </div>
            ))}
            </div>
          </div>
        ))}
      </div>
      <div className="date-list">
        {movies.flatMap(movie => movie.showtimes.map(showtime => new Date(showtime.Date).toISOString().split("T")[0])).filter((date, index, self) => self.indexOf(date) === index && new Date(date) >= new Date()).sort((a, b) => new Date(a) - new Date(b)).map(date => (
          <div
            key={date}
            className={`date-item${selectedDate === date ? " selected" : ""}`}
            onClick={(event) => handleDateChange(event, date)}
          >
            <h3>{new Date(date).toLocaleDateString("en-GB")}</h3>
          </div>
        ))}
      </div>
      <div className="showtime-details">
        {filteredShowtimes.map(showtime => (
          <div key={showtime.ShowTime_ID} className="showtime-item">
            <p>{new Date(showtime.Date).toLocaleDateString("en-GB")}</p>
            <p>{showtime.StartTime}</p>
          </div>
        ))}
      </div>
    </div>
 );
};

export default TheaterDetails;