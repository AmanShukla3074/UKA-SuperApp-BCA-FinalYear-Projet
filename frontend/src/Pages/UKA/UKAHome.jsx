// import React from "react";
// import "./UKAHome.css"; // Import the CSS file
// import homepageImage from "../../Components/Assets/homepage.jpg";
// import ecImage from "../../Components/Assets/ec.avif";
// import mb3Image from "../../Components/Assets/mb3.jpg";
// import ms3Image from "../../Components/Assets/ms3.webp";

// const UKAHome = () => {
//   return (
//     <div>
//       <header style={{ backgroundImage: `url(${homepageImage})` }}>
//         <div className="wrapper"></div>
//         <div className="welcome-text">
//           <h1>UKA</h1>
//           <a href="#">explore more</a>
//         </div>
//       </header>

//       <div className="box">
//         <div className="container1">
//           <div className="box1">
//             <img src={ecImage} alt="" className="UKAhomeImg" />
//           </div>
//           <div className="right">
//             <p className="space">
//               &nbsp;&nbsp;&nbsp;Discover a world of endless possibilities at
//               UKA, where convenience meets style. Browse through our vast
//               collection of fashion, electronics, home decor, beauty products,
//               and much more, all at your fingertips.
//               <br />
//               &nbsp;&nbsp;&nbsp;Enjoy seamless navigation, secure transactions,
//               and lightning-fast delivery right to your doorstep. Whether you're
//               searching for the latest trends or timeless classics, UKA has
//               everything you need to elevate your shopping experience.
//               <br />
//               &nbsp;&nbsp;&nbsp; Shop smart, shop with confidence, shop at UKA.
//               Start exploring now!
//             </p>
//           </div>
//         </div>
//         <div className="container2">
//           <div className="left">
//             <p className="space">
//               &nbsp;&nbsp;&nbsp;Welcome to UKA, your ultimate destination for
//               seamless movie ticket booking. Step into a world where convenience
//               meets entertainment, where booking your favorite movies is just a
//               few clicks away.
//               <br />
//               &nbsp;&nbsp;&nbsp;At UKA, we're dedicated to enhancing your cinema
//               experience by providing hassle-free ticketing services.
//               <br />
//               &nbsp;&nbsp;&nbsp;With our user-friendly interface and extensive
//               movie listings, finding and securing your preferred seats has
//               never been easier. Say goodbye to long queues and last-minute
//               rushes – embrace the ease and excitement of booking your next
//               movie adventure with UKA.
//             </p>
//           </div>
//           <div className="box2">
//             <img src={mb3Image} alt="" className="UKAhomeImg" />
//           </div>
    
//         </div>
//         <div className="container1">
//           {/* <div
//             className="left img"
//             style={{ backgroundImage: `url(${})` }}
//           >
//             <div className="box3"></div>
//           </div> */}
//           <div className="box3">
//             <img src={ms3Image} alt="" className="UKAhomeImg" />
//           </div>
//           <div className="right">
//             <p className="space">
//               &nbsp;&nbsp;&nbsp; Welcome to UKA, your ultimate destination for
//               immersive music streaming experiences. Dive into a world where
//               melody meets innovation, and your favorite tunes are just a click
//               away.
//               <br />
//               &nbsp;&nbsp;&nbsp; Welcome to UKA, your ultimate destination for
//               immersive music streaming experiences. Dive into a world where
//               melody meets innovation, and your favorite tunes are just a click
//               away.
//               <br />
//               &nbsp;&nbsp;&nbsp;With our intuitive interface and personalized
//               recommendations, exploring new sounds and rediscovering classics
//               has never been easier. Join us at UKA and embark on a musical
//               adventure tailored just for you.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UKAHome;

// // import React from 'react';
// // import './UKAHome.css'; // Import the CSS file
// // import homepageImage from '../../Components/Assets/homepage.jpg'
// // import ecImage from '../../Components/Assets/ec.avif';
// // import mb3Image from '../../Components/Assets/mb3.jpg';
// // import ms3Image from '../../Components/Assets/ms3.webp';

// // const UKAHome = () => {
// //  return (
// //     <div>
// //       <header style={{ backgroundImage: `url(${homepageImage})`}}>
// //         <div className="wrapper"></div>
// //         <div className="welcome-text">
// //           <h1>UKA</h1>
// //           <a href="#">explore more</a>
// //         </div>
// //       </header>

// //       <div className="box">
// //         <div className="container1">
// //         <div className="left img" style={{ backgroundImage: `url(${ecImage})` }}>
// //             <div className="box1"></div>
// //           </div>
// //           <div className="right">
// //             <p className="space">
// //               &nbsp;&nbsp;&nbsp;Discover a world of endless possibilities at UKA, where convenience meets style. Browse through our vast collection of fashion, electronics, home decor, beauty products, and much more, all at your fingertips.
// //               <br />
// //               &nbsp;&nbsp;&nbsp;Enjoy seamless navigation, secure transactions, and lightning-fast delivery right to your doorstep. Whether you're searching for the latest trends or timeless classics, UKA has everything you need to elevate your shopping experience.
// //               <br />
// //               &nbsp;&nbsp;&nbsp; Shop smart, shop with confidence, shop at UKA. Start exploring now!
// //             </p>
// //           </div>
// //         </div>
// //         <div className="container2">
// //           <div className="left">
// //             <p className="space">
// //               &nbsp;&nbsp;&nbsp;Welcome to UKA, your ultimate destination for seamless movie ticket booking. Step into a world where convenience meets entertainment, where booking your favorite movies is just a few clicks away.
// //               <br />
// //               &nbsp;&nbsp;&nbsp;At UKA, we're dedicated to enhancing your cinema experience by providing hassle-free ticketing services.
// //               <br />
// //               &nbsp;&nbsp;&nbsp;With our user-friendly interface and extensive movie listings, finding and securing your preferred seats has never been easier. Say goodbye to long queues and last-minute rushes – embrace the ease and excitement of booking your next movie adventure with UKA.
// //             </p>
// //           </div>
// //           <div className="right img" style={{ backgroundImage: `url(${mb3Image})` }}>
// //             <div className="box2"></div>
// //           </div>
// //         </div>
// //         <div className="container1">
// //         <div className="left img" style={{ backgroundImage: `url(${ms3Image})` }}>
// //             <div className="box3"></div>
// //           </div>
// //           <div className="right">
// //             <p className="space">
// //               &nbsp;&nbsp;&nbsp; Welcome to UKA, your ultimate destination for immersive music streaming experiences. Dive into a world where melody meets innovation, and your favorite tunes are just a click away.
// //               <br />
// //               &nbsp;&nbsp;&nbsp; Welcome to UKA, your ultimate destination for immersive music streaming experiences. Dive into a world where melody meets innovation, and your favorite tunes are just a click away.
// //               <br />
// //               &nbsp;&nbsp;&nbsp;With our intuitive interface and personalized recommendations, exploring new sounds and rediscovering classics has never been easier. Join us at UKA and embark on a musical adventure tailored just for you.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //  );
// // };

// // export default UKAHome;
