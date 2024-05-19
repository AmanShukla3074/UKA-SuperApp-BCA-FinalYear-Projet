import React, { useContext } from 'react'
import { AlbumContainer, HomeMusic } from '../../Components'
import MusicContainer from '../../Components/Music_Streaming/MusicContainer/MusicContainer'
import AuthContext from '../../Context/AuthContext';

const MusicHome = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>

{user ? (
        <> 
         <HomeMusic/>
        </>
      ) : (
        <></>
      )}

     
      <MusicContainer/>
      {/* <AlbumContainer/> */}
    </div>
  )
}

export default MusicHome
