import Carousel from "react-bootstrap/Carousel";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const HomePage = () => {
  return (
    <div className="container-fluid text-center my-3">
      <h1 className="display-4 fw-bold">Administración de Guardias Médicas</h1>

      <Carousel fade>
        <Carousel.Item>
          <img
            src={img1}
            alt="First slide"
            className="img-fluid rounded"
            style={{ width: "100%", maxHeight: "75vh", aspectRatio: "1" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={img2}
            alt="Second slide"
            className="img-fluid rounded"
            style={{ width: "100%", maxHeight: "75vh", aspectRatio: "1" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            src={img3}
            alt="Third slide"
            className="img-fluid rounded"
            style={{ width: "100%", maxHeight: "75vh", aspectRatio: "1" }}
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default HomePage;
