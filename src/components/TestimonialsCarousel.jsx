import React, { useState, useEffect, Suspense, lazy, useCallback } from "react";
import "../components/TestimonialsCarousel.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = lazy(() => import("react-slick"));

const TestimonialsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3); 
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

 
  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await fetch("./testimonials.json"); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received content is not JSON");
      }

      const data = await response.json();
      setTestimonials(data);
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError(error.message); 
      setLoading(false);
    }
  }, []);

 
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  
  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(window.innerWidth <= 768 ? 1 : 3);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: slidesToShow === 1 ? "0px" : "100px",
    cssEase: "ease-in-out",
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  
  const getClassForSlide = useCallback(
    (index) => {
      const visibleSlideIndex =
        (index - currentSlide + testimonials.length) % testimonials.length;
      return visibleSlideIndex % 2 === 0 ? "even" : "odd";
    },
    [currentSlide, testimonials.length]
  );

  return (
    <div className="carousel-container">
      <h1>What User says</h1>
      <h2>
        Testimonials that speak louder than words! Customer stories that light
        up our day.
      </h2>
      {loading ? (
        <p className="loading-ico">Loading testimonials...</p>
      ) : error ? (
        <p className="error-msg">Error: {error}</p> 
      ) : testimonials.length > 0 ? (
        <Suspense fallback={<div className="loading-ico">Loading slider...</div>}>
          <Slider {...settings}>
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`testimonial-card ${getClassForSlide(index)}`}
              >
                <div className="card-content">
                  <span>
                    <img src={testimonial.img} alt={testimonial.text} />
                  </span>
                  <h4>{testimonial.text}</h4>
                  <p>{testimonial.content}</p>
                </div>
              </div>
            ))}
          </Slider>
        </Suspense>
      ) : (
        <p>No testimonials available.</p>
      )}
    </div>
  );
};

export default TestimonialsCarousel;
