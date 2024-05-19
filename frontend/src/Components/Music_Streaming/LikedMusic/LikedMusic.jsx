import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../../Context/AuthContext";
import MusicItem from "../MusicItem/MusicItem";
const LikedMusic = () => {
 const [likedMusic, setLikedMusic] = useState([]);
 const { authTokens } = useContext(AuthContext);
 
 useEffect(() => {
    const fetchLikedMusic = async () => {
        try {
            const response = await axios.get(
              "http://127.0.0.1:8000/api/Music/liked-music/",
              {
                headers: {
                  Authorization: `Bearer ${authTokens?.access}`,
                },
              }
            );
            setLikedMusic(response.data);
            console.log(response.data);
          } catch (error) {
            console.error("Error fetching liked music:", error);
          }
    };

    fetchLikedMusic();
 }, [authTokens]);

 return (
<>
    <h1 className="searchMusicHeader">Liked Music</h1>
    <div className="musicContainer">
      {likedMusic.map((item) => (
        <MusicItem
          key={item.music.Music_ID}
          id={item.music.Music_ID}
          name={item.music.Music_Title}
          image={`http://127.0.0.1:8000${item.music.cover}`}
          artist={item.music.Artist}
          item={item.music}
        />
      ))}
    </div>
    </>
 );
};

export default LikedMusic;
