import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// import AlbumItem from '../AlbumItem/AlbumItem'; // Assuming you have an AlbumItem component
import './AlbumContainer.css';
import AuthContext from '../../../Context/AuthContext'; // Adjust the import path as necessary


const AlbumContainer = () => {
    const [albumData, setAlbumData] = useState([]);
    const { authTokens } = useContext(AuthContext); // Access the authTokens from AuthContext
   
    useEffect(() => {
       const fetchAlbumData = async () => {
         try {
           const response = await axios.get('http://127.0.0.1:8000/api/Music/album/', {
             headers: {
               Authorization: `Bearer ${authTokens?.access}`, // Use the access token from authTokens
             },
           });
           setAlbumData(response.data);
           console.log(response.data);
         } catch (error) {
           console.error('Error fetching album data:', error);
         }
       };
   
       fetchAlbumData();
    }, [authTokens]); // Add authTokens as a dependency to re-fetch data when the token changes
   
    return (
       <div>
         <h1>Explore Albums</h1>
         <div className='albumContainer'>
           {/* {albumData.slice(0, 20).map((album) => (
             <AlbumItem 
               key={album.Album_ID}
               id={album.Album_ID}
               title={album.Album_Title}
               releaseDate={album.ReleaseDate}
               noOfSongs={album.No_Of_Songs}
               artist={album.Artist}
               album={album}
             />
           ))} */}
         </div>
       </div>
    );
   };
   
   export default AlbumContainer;
   