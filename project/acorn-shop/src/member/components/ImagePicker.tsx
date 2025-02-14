import React, { useState } from "react";

type ImageSliderProps = {
  images: string[];
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return <div className="text-center text-gray-500">No images available</div>;
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-80 h-48 mx-auto overflow-hidden rounded-lg shadow-lg">
      {/* 현재 이미지 하나만 출력 */}
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1} of ${images.length}`}
        className="w-full h-full object-cover"
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
        <div>
          {images.map((_, index) => (
            <span key={index} onClick={() => setCurrentIndex(index)}>
              ㅇ
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
