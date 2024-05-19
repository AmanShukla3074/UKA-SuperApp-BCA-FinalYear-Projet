import React, { useState, useEffect, useContext } from 'react';
import './PlaylistHome.css';
import axios from 'axios';
// import { Movie_Item } from '../..';
import AuthContext from '../../../../Context/AuthContext'; // Adjust the path as necessary
import PlaylistItem from '../PlaylistItem/PlaylistItem';

const PlaylistHome = () => {
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
 }, [authTokens]);
 return (
    <div>
      <h1>PlayList</h1> 
        
      <div className="playlistcontainer">
        {data.map((item) => (
          <PlaylistItem 
            key={item.Playlist_ID}
            Playlistid={item.Playlist_ID}
            PlaylistName={item.Playlist_Title}
          />
        ))}
      </div>
    </div>
 );
};

export default PlaylistHome;

