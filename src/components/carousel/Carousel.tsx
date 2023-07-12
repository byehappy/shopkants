import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type CarouselProps = {
    items: React.ReactNode[];
    settings?: Settings;
};

const MyCarousel: React.FC<CarouselProps> = ({ items, settings = {} }) => {
    return (
        <Slider {...settings}>
            {items.map((item, index) => (
                <div key={index}>{item}</div>
            ))}
        </Slider>
    );
};

export default MyCarousel;