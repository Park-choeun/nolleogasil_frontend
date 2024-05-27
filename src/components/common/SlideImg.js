import styles from "./SlideImg.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";

function SlideImg() {

    return (
        //검은화살표하고 싶으면  div에 data-bs-theme="dark"추가
        <div className={styles.train}>
            <Carousel className={styles.show}>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture1.jpg"} alt="picture1" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture2.jpg"} alt="picture2" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture3.jpg"} alt="picture3" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture4.jpg"} alt="picture4" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture5.jpg"} alt="picture5" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture6.jpg"} alt="picture6" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture7.jpg"} alt="picture7" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className={styles.picture} src={"/images/main/slideImg/picture8.jpg"} alt="picture8" />
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default SlideImg;