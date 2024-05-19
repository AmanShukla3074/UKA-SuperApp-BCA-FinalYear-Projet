import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  Navbar,
  MovieBooking,
  MusicStreaming,
  Ecommerce,
  Cart,
  Footer,
  MovieDetails,
  Showtimes,
  SeatShowtime,
  TheaterDetails,
  // AddMusicForm,
  MyMusic,
  BookingDetails,
  OrdersList,
  ECOrderDetail,
  LikedMusic,
} from "./Components";
import {
  // Home,
  EChome,
  ECCategory,
  ECProductDetail,
  MBhome,
  RegiPage,
  LoginPage,
  OTPPage,
  AddressPage,
  ChangePassPage,
  ForgotPassPage,
  PlaylistPage,
  MusicHome,
  MusicAddPage,
  AlbumAddPage,
  MusicSearchPage,
  BookingsPage,
  WishlistPage,
  AlbumPage,
  ArtistPage,
  ArtistRegiFormPage,
  ArtistPanelPage,
  // UKAHome,
} from "./Pages/index.js";
// import { Cart } from './Components/Ecom/index';
import { AuthProvider } from "./Context/AuthContext";
import songContext from "./Context/songContext.js";
import { MenuContext, MenuContextProvider } from "./Context/MenuContext.js";
import MyAlbum from "./Components/Music_Streaming/MyAlbum/MyAlbum.jsx";

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1.0); // Default volume is 1.0 (full volume)

  const seekTo = (time) => {
    console.log("Seeking to:", time);
    setCurrentTime(time);
    if (soundPlayed) {
      soundPlayed.seek(time);
    }
  };

  const increaseVolume = () => {
    setVolume(Math.min(volume + 0.1, 1.0)); // Increase volume by 0.1, up to a maximum of 1.0
  };

  const decreaseVolume = () => {
    setVolume(Math.max(volume - 0.1, 0.0)); // Decrease volume by 0.1, down to a minimum of 0.0
  };

  const playNextSong = () => {
    setCurrentSongIndex((currentSongIndex + 1) % playlist.length);
    setCurrentSong(playlist[currentSongIndex]);
  };

  const playPreviousSong = () => {
    setCurrentSongIndex(
      (currentSongIndex - 1 + playlist.length) % playlist.length
    );
    setCurrentSong(playlist[currentSongIndex]);
  };
  return (
    <Router>
      <AuthProvider>
        <MenuContextProvider>
          <songContext.Provider
            value={{
              playlist,
              setPlaylist,
              currentSongIndex,
              setCurrentSongIndex,
              currentSong,
              setCurrentSong,
              soundPlayed,
              setSoundPlayed,
              isPaused,
              setIsPaused,
              playNextSong,
              playPreviousSong,
              volume,
              setVolume,
              increaseVolume,
              decreaseVolume,
              songDuration,
              setSongDuration,
              currentTime,
              setCurrentTime,
              seekTo,
            }}
          >
            <Navbar />
            <Routes>
              <Route path="/" element={<EChome />} />
              {/* <Route path="/" element={<UKAHome />} /> */}
              <Route path="/registration" element={<RegiPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/otp" element={<OTPPage />} />
              <Route path="/address" element={<AddressPage />} />
              <Route path="/changepassword" element={<ChangePassPage />} />
              <Route path="/forgotpassword" element={<ForgotPassPage />} />

              <Route path="/ecommerce" element={<Ecommerce />}>
                <Route index element={<EChome />} />
                <Route path="home" element={<EChome />} />
                <Route
                  path="Hoodie"
                  element={<ECCategory category="hoodie" />}
                />
                <Route
                  path="Sweatshirts"
                  element={<ECCategory category="sweatshirts" />}
                />
                {/* <Route path="Tees" element={<ECCategory category="tees" />} /> */}
                <Route path="Caps" element={<ECCategory category="caps" />} />
                <Route path="Jeans" element={<ECCategory category="jeans" />} />
                <Route path="Shoes" element={<ECCategory category="shoes" />} />
                <Route path="cart" element={<Cart />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="orderlist" element={<OrdersList />} />
                <Route path="orderdetails" element={<ECOrderDetail />}>
                  <Route path=":orderdetailsId" element={<ECOrderDetail />} />
                </Route>
                <Route path="product" element={<ECProductDetail />}>
                  <Route path=":productId" element={<ECProductDetail />} />
                </Route>
              </Route>
              <Route path="/moviebooking" element={<MovieBooking />}>
                <Route index element={<MBhome />} />
                <Route path="home" element={<MBhome />} />
                <Route path="movies" element={<MBhome />} />
                <Route path="movie" element={<MovieDetails />}>
                  <Route path=":movieId" element={<MovieDetails />} />
                </Route>

                <Route
                  path="showtimes/:movieId/:movieType/:movieLang?"
                  element={<Showtimes />}
                />
                <Route
                  path="showtime-seat/:showtimeId/"
                  element={<SeatShowtime />}
                />
                <Route
                  path="booking-detail/:bookingId/"
                  element={<BookingDetails />}
                />
                <Route path="bookings" element={<BookingsPage />} />
                <Route
                  path="theater/:theaterId/"
                  element={<TheaterDetails />}
                />
              </Route>
              <Route path="/musicstreaming" element={<MusicStreaming />}>
                <Route index element={<MusicHome />} />
                <Route path="home" element={<MusicHome />} />
                <Route path="playlist/:playlistId" element={<PlaylistPage />} />
                <Route path="album/:albumId" element={<AlbumPage />} />
                <Route path="artist/:artistId" element={<ArtistPage />} />
                <Route path="add-music" element={<MusicAddPage />} />
                <Route path="add-album" element={<AlbumAddPage />} />
                <Route path="mymusic" element={<MyMusic />} />
                <Route path="myalbum" element={<MyAlbum />} />
                <Route path="search" element={<MusicSearchPage />} />
                <Route path="liked-music" element={<LikedMusic />} />
                <Route path="add-artist" element={<ArtistRegiFormPage />} />
                <Route path="artist-panel" element={<ArtistPanelPage />} />
              </Route>
            </Routes>
            <Footer />
          </songContext.Provider>
        </MenuContextProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
