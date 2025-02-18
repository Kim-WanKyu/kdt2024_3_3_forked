import React, { useState } from "react";
import "./css/ImagePicker.css";

type ImageSliderProps = {
  images: string[];
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 기본 이미지 URL
  const defaultImage = "https://i.imgur.com/HCe1Gv1.png";

  // 이미지가 없을 경우 기본 이미지로 대체
  const currentImage =
    images.length === 0 ? defaultImage : images[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="image-slider">
      {/* 이미지가 없을 경우 기본 이미지 출력 */}
      <img
        src={currentImage}
        alt={`Image ${currentIndex + 1} of ${images.length || 1}`}
      />

      {/* 좌우 네비게이션 버튼 */}
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} aria-label="Previous slide">
            ❮
          </button>
          <button onClick={nextSlide} aria-label="Next slide">
            ❯
          </button>
        </>
      )}

      {/* 슬라이드 인디케이터 */}
      {images.length > 1 && (
        <div className="image-slider-indicators">
          {images.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={index === currentIndex ? "active" : ""}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
