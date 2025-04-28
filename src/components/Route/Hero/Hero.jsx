import React from "react";
import Slider from "react-slick";
import { sliderData } from "../../../static/data";

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <>
      {/* Hero Slider */}
      <div className="w-full overflow-hidden rounded-xl shadow-lg">
        <Slider {...settings}>
          {sliderData.map((item, index) => (
            <div key={index} className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[150px] sm:h-[200px] md:h-[500px] lg:h-[300px] object-cover rounded-xl"
              />
              {/* Optional overlay for title or content */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h2 className="text-white text-2xl md:text-4xl font-bold">{item.title}</h2>
              </div> */}
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Hero;
