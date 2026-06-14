import carousel from "../images/AU.jpg";
import AU1 from "../images/AU1.jpg";
import AU2 from "../images/AU2.jpg";
import AU3 from "../images/AU3.jpg";

const Carousel = () => {
  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="3"
        ></button>
      </div>

      <div className="carousel-inner">
        {/* Existing AU image */}
        <div className="carousel-item active">
          <img src={carousel} className="d-block w-100" alt="AU" />
        </div>

        {/* Added images */}
        <div className="carousel-item">
          <img src={AU1} className="d-block w-100" alt="AU1" />
        </div>

        <div className="carousel-item">
          <img src={AU2} className="d-block w-100" alt="AU2" />
        </div>

        <div className="carousel-item">
          <img src={AU3} className="d-block w-100" alt="AU3" />
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};

export default Carousel;
