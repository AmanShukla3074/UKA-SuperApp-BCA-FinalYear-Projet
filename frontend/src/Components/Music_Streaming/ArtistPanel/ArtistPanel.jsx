import React, { useContext, useEffect, useState } from "react";
import { IoMdMusicalNotes, IoMdAddCircle } from "react-icons/io";
import { TbMusicPlus } from "react-icons/tb";
import { RiAlbumFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./ArtistPanel.css"; // Make sure to create this CSS file

const ArtistPanel = () => {
 const navigate = useNavigate();
 

 return (
    <div className="artist-panel">
      <div className="artist-panel-row">
        <div className="artist-panel-box" onClick={() => navigate("/musicstreaming/add-music")}>
          {/* <IoMdAddCircle /> */}
          <TbMusicPlus/> 
          <span>Add Music</span>
        </div>
        <div className="artist-panel-box" onClick={() => navigate("/musicstreaming/mymusic")}>
          <IoMdMusicalNotes />
          <span>My Music</span>
        </div>
      </div>
      <div className="artist-panel-row">
        <div className="artist-panel-box" onClick={() => navigate("/musicstreaming/add-album")}>
          <RiAlbumFill />
          <span>Add Album</span>
        </div>
        <div className="artist-panel-box" onClick={() => navigate("/musicstreaming/myalbum")}>
          <RiAlbumFill />
          <span>My Album</span>
        </div>
      </div>
    </div>
 );
};

export default ArtistPanel;
