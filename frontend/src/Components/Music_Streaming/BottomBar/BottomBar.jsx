import React, { useContext, useState, useEffect } from "react";
import "./BottomBar.css";
import { IoShuffleOutline } from "react-icons/io5";
import { BiSolidSkipPreviousCircle } from "react-icons/bi";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { IoPauseCircleSharp } from "react-icons/io5";
import { IoIosPlayCircle } from "react-icons/io";
import { IoMdRepeat } from "react-icons/io";
import { CgPlayListAdd } from "react-icons/cg";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Import heart icons
import songContext from "../../../Context/songContext";
import AddToPlaylistModal from "../Modals/AddToPlaylistModal/AddToPlaylistModal";
import axios from "axios";
import AuthContext from "../../../Context/AuthContext";
import VolumeControl from "../VolumeControl/VolumeControl";
import SongScrubber from "../SongScrubber/SongScrubber ";

const BottomBar = ({ togglePlayPause }) => {
  const {
    volume,
    soundPlayed,
    currentSong,
    isPaused,
    playNextSong,
    playPreviousSong,
    setCurrentTime,
    currentTime,
  } = useContext(songContext);

  const { authTokens } = useContext(AuthContext);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikedStatus = async () => {
      if (!currentSong || !authTokens) return; // Ensure currentSong and authTokens are available

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Music/liked-music/${currentSong.Music_ID}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
        setLiked(!!response.data.PlaylistMusic_ID);
      } catch (error) {
        // If the song is not in the "liked" playlist, the API might return a 404 error
        // In this case, we assume the song is not liked
        if (error.response && error.response.status === 404) {
          setLiked(false);
        } else {
          console.error("Error fetching liked status:", error.message);
        }
      }
    };

    fetchLikedStatus();
  }, [currentSong, authTokens]); // Depend on both currentSong and authTokens

  //  useEffect(() => {
  //   console.log("Updated Liked State:", liked);
  //  }, [liked]);

  const toggleLiked = async () => {
    try {
      if (liked) {
        await axios.delete(
          `http://127.0.0.1:8000/api/Music/liked-music/${currentSong.Music_ID}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/Music/liked-music/",
          {
            music_id: currentSong.Music_ID,
          },
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
            },
          }
        );
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling liked status:", error.message);
    }
  };

  const increaseMusicStreams = async () => {
    if (currentSong) {
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/Music/music/${currentSong.Music_ID}/stream/`
        );
      } catch (error) {
        console.error("Error increasing music streams:", error.message);
      }
    }
  };

  useEffect(() => {
    if (soundPlayed) {
      soundPlayed.seek(currentTime);
    }
  }, [currentTime, soundPlayed]);

  useEffect(() => {
    if (soundPlayed) {
      soundPlayed.volume(volume);
    }
  }, [volume, soundPlayed]);

  const getCoverUrl = (cover) => {
    const baseUrl = "http://127.0.0.1:8000";
    if (!cover.startsWith(baseUrl)) {
      return baseUrl + cover;
    }
    return cover;
  };

  const addSongToPlaylist = async (playlistId) => {
    const songId = currentSong.Music_ID;

    const payload = {
      Playlist_ID: playlistId,
      Music_ID: songId,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Music/playlist-Music/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
          },
        }
      );

      if (response.data && response.data.Music_ID) {
        setAddToPlaylistModalOpen(false);
      } else {
        console.error("Failed to add song to playlist");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error.message);
    }
  };

  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  return (
    <div className={`${currentSong ? "" : "hidden"} bottom-bar`}>
      {addToPlaylistModalOpen && (
        <AddToPlaylistModal
          closeModal={() => {
            setAddToPlaylistModalOpen(false);
          }}
          addSongToPlaylist={addSongToPlaylist}
        />
      )}
      <div className="bottom-bar-left">
        {currentSong && (
          <>
            <div className="bottom-bar-img-container">
              <img
                className="bottom-bar-img"
                src={getCoverUrl(currentSong.cover)}
                alt={currentSong.Music_Title}
              />
            </div>
            <div className="bottom-barDetails">
              <div className="bottom-barTitle">{currentSong.Music_Title}</div>
              <div className="bottom-barArtists">
                {currentSong.Artist.map((artistItem, index) => (
                  <div key={artistItem.Artist_ID} className="artist-info">
                    {artistItem.Artist_Name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="bottom-bar-center">
        <div className="bottomBarscontrols">
          <div className="bottomBarscontrols-center">
            <div className="prevSong">
              <BiSolidSkipPreviousCircle
                className="bottomcenterMarginBottom"
                onClick={() => {
                  playPreviousSong();
                  increaseMusicStreams();
                }}
              />
            </div>
            <div className="PlayPause" onClick={togglePlayPause}>
              {isPaused ? (
                <IoIosPlayCircle fontSize={"50px"} />
              ) : (
                <IoPauseCircleSharp fontSize={"50px"} />
              )}
            </div>
            <div className="nextSong">
              <BiSolidSkipNextCircle
                className="bottomcenterMarginBottom"
                onClick={() => {
                  playNextSong();
                  increaseMusicStreams();
                }}
              />
            </div>
          </div>
        </div>
        <div className="bottomScrubber">
          <SongScrubber />
        </div>
      </div>
      <div className="bottom-bar-right">
        <div className="volControlBot">
          <VolumeControl />
        </div>
        <div className="likeButton" onClick={toggleLiked}>
          {liked ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
        </div>
        <div
          className="addToPlaylist"
          onClick={() => setAddToPlaylistModalOpen(true)}
        >
          <CgPlayListAdd />
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
