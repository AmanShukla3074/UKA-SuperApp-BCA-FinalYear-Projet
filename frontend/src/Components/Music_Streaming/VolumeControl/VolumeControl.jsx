import React, { useContext } from 'react';
import songContext from '../../../Context/songContext'; // Adjust the import path as necessary
import './VolumeControl.css'
const VolumeControl = () => {
 const { volume, setVolume, increaseVolume, decreaseVolume } = useContext(songContext);

 const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
 };

 return (
    <div className='volControl'>
      <button className='volControlBtn' onClick={decreaseVolume}>-</button>
      <input className='volControlScroll'
        type="range"
        min="0.0"
        max="1.0"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      <button className='volControlBtn' onClick={increaseVolume}>+</button>
    </div>
 );
};

export default VolumeControl;
