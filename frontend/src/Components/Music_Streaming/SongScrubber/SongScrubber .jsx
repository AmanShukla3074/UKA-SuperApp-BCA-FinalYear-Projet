import React, { useContext } from 'react';
import songContext from '../../../Context/songContext'; // Adjust the import path as necessary

const SongScrubber = () => {
 const { songDuration, currentTime, seekTo } = useContext(songContext);

 const handleTimeChange = (event) => {
    const newTime = parseFloat(event.target.value);
    console.log("Scrubber Value Changed:", newTime);
    seekTo(newTime);
};

 return (
    <input
      type="range"
      min="0"
      max={songDuration}
      value={currentTime}
      onChange={handleTimeChange}
    />
 );
};

export default SongScrubber;
