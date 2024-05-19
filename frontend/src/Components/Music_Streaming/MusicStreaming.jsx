import React, { useContext, useLayoutEffect, useRef } from "react";
import "./MusicStreaming.css";
import SIdebar from "./Sidebar/SIdebar";
import {Howl, Howler} from "howler";
import { Outlet } from "react-router-dom";
import BottomBar from "./BottomBar/BottomBar";
import songContext from "../../Context/songContext";
function MusicStreaming() {
  const {
    currentSong,
    setCurrentTime,
    soundPlayed,
    setSoundPlayed,
    isPaused,
    setIsPaused,
    setSongDuration,
  } = useContext(songContext);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
      // the following if statement will prevent the useEffect from running on the first render.
      if (firstUpdate.current) {
          firstUpdate.current = false;
          return;
      }

      if (!currentSong) {
          return;
      }
      changeSong(currentSong.file);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong && currentSong.file]);

  const playSound = () => {
    if (!soundPlayed) {
        return;
    }
    soundPlayed.play();
};

const changeSong = (songSrc) => {
  if (soundPlayed) {
     soundPlayed.stop();
  }
  setCurrentTime(0);
  const baseUrl = "http://127.0.0.1:8000";
  if (!songSrc.startsWith(baseUrl)) {
     songSrc = baseUrl + songSrc;
  }

  const sound = new Howl({
    src: [songSrc],
    onload: () => {
      const duration = sound.duration();
      setSongDuration(duration);
    },
    onplay: () => {
      const interval = setInterval(() => {
        if (sound.playing()) {
          const current = sound.seek();
          setCurrentTime(current);
        } else {
          clearInterval(interval);
        }
      }, 1000); // Update every second
   },
    // Other options...
   });
   setSoundPlayed(sound);
   
  sound.play();
  setIsPaused(false);
 };
 

const pauseSound = () => {
    soundPlayed.pause();
};

const togglePlayPause = () => {
    if (isPaused) {
        playSound();
        setIsPaused(false);
    } else {
        pauseSound();
        setIsPaused(true);
    }
};

  return (
    <>
      <div className="musicContain">
        <div
          className={`${currentSong ? "sidebar-half" : "sidebar-full"} sidebar`}
        >
          {/* <div className="sidebar"> */}
          <SIdebar />
        </div>
        <div className={`${currentSong ? "Main-half" : "Main-full"} Main`}>
          <Outlet />
        </div>
      </div>
      <BottomBar togglePlayPause={togglePlayPause} />
    </>
  );
}

export default MusicStreaming;
