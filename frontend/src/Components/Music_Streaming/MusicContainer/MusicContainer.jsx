import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MusicItem from '../MusicItem/MusicItem';
import './MusicContainer.css'
const MusicContainer = () => {
 const [musicData, setMusicData] = useState([]);

 useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/Music/get-music/');
        setMusicData(response.data);
      } catch (error) {
        console.error('Error fetching music data:', error);
      }
    };

    fetchMusicData();
 }, []);

 return (
    <div>
      <h1>Explore Music</h1>
      <div className='musicContainer'>
      {musicData.slice(0, 20).map((item) => (
        <MusicItem 
          key={item.Music_ID}
          id={item.Music_ID}
          name={item.Music_Title}
          image={item.cover}
          artist={item.Artist}
          item={item}
        />
      ))}
      </div>
    </div>
 );
};

export default MusicContainer;
