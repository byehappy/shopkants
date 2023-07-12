import MyCarousel from "./Carousel";
import {
    Container,
    ContText,Image,
} from './Carousel.style'
import React from "react";


const MyPage: React.FC = () => {
    const items = [
        <Container key="1">
            <ContText>
                <Image src={'https://partner-online.ru/images/banners/b2.jpg'}/>
            </ContText>
        </Container>,
        <Container key="2">
            <ContText>
                <Image src={'https://media.komus.ru/medias/sys_master/root/hf0/h4c/11786165813278/-3-693609-50-Zhuasbekov-min.jpg'}/>
            </ContText>
        </Container>,
        <Container key="3">
            <ContText>
                <Image src={'https://media.komus.ru/medias/sys_master/root/hcd/h54/11799825842206/-3-704269-Bruno-Visconti-Zhuasbekov-2-min-002-.jpg'}/>
            </ContText>
        </Container>
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000
    };

    return (
        <div style={{width:'96vw', margin: "2vw auto"}}>
            <MyCarousel items={items} settings={settings}/>
        </div>
    );
};

export default MyPage;