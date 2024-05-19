import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import interstellar from '../../Assets/MB_IMGS/intersteller.jpg';
import mi7cover from '../../Assets/MB_IMGS/mi7cover.jpg';
import jumanjicover from '../../Assets/MB_IMGS/jumanjicover.jpg';

const ImgSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const movieImages = [interstellar, mi7cover, jumanjicover];

  return (
    <Slider {...settings}>
      {movieImages.map((image, index) => (
        <div key={index} className="slide-container">
          <img src={image} alt={`Movie ${index + 1}`} />
        </div>
      ))}
    </Slider>
  );
};

export default ImgSlider;
