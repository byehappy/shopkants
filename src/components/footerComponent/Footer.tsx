import {Button, Contact, Container, ContainerButton, ContainerInfo, Logo} from "./Footer.style";

const Footer = () => {
    return (
        <Container>
            <Logo to={'/'}>Shopkants
                <span>Интернет-магазин канцтоваров</span>
            </Logo>
            <Contact>
                +7(900)888 - 77 - 66
                <br/>
                Номер тех. поддержки
            </Contact>
            <ContainerButton>
                <Button to={'/catalog'}>Каталог</Button>
                <Button to={'/catalog'}>Каталог</Button>
                <Button to={'/catalog'}>Каталог</Button>
                <Button to={'/catalog'}>Каталог</Button>
                <Button to={'/catalog'}>Каталог</Button>
                <Button to={'/catalog'}>Каталог</Button>
            </ContainerButton>
            <ContainerInfo>
                <Button to={'/catalog'}>Другая информация</Button>
                <Button to={'/catalog'}>Другая информация</Button>
                <Button to={'/catalog'}>Другая информация</Button>
            </ContainerInfo>
        </Container>
    );
};

export default Footer;