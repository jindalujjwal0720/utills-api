import React, { useEffect, useRef, useState } from "react";
import styles from "./Preview.module.css";
import { useResume } from "../context/Resume";
import { htmlToCanvasImage } from "../../../utils/html_to_canvas_image";

const Preview = () => {
  const { values, printContainerRef } = useResume();
  const previewRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageTransformsY, setImageTransformsY] = useState([]);
  const [selectedImageTransformY, setSelectedImageTransformY] = useState(0);

  const getA4Images = () => {
    const newImage = new Image();
    newImage.src = image;
    newImage.onload = () => {
      const width = newImage.width;
      const height = newImage.height;
      const a4aspectRatio = 210 / 297;
      const a4Width = width;
      const a4Height = a4Width / a4aspectRatio;
      let h = height - a4Height;
      const transformsY = [];
      transformsY.push(0);
      let transformY = 1;
      while (h > 0) {
        transformsY.push(transformY);
        transformY += 1;
        h -= a4Height;
      }
      setImageTransformsY(transformsY);
    };
  };

  useEffect(() => {
    if (values) {
      printContainerRef.current &&
        htmlToCanvasImage(printContainerRef.current).then((img) => {
          // console.log(img);
          setImage(img);
          getA4Images();
        });
    }
  }, [values]);

  return (
    <div className={styles.preview}>
      <div className={styles.dots}>
        {imageTransformsY &&
          imageTransformsY.map((_, index) => (
            <span
              key={index}
              className={
                styles.dot +
                (index === selectedImageTransformY ? " " + styles.selected : "")
              }
              onClick={() => setSelectedImageTransformY(index)}
            ></span>
          ))}
      </div>
      <div ref={previewRef} className={styles.preview_image}>
        {image && (
          <img
            src={image}
            alt="Resume"
            style={{
              transform: `translateY(-${
                imageTransformsY[selectedImageTransformY] *
                previewRef.current.offsetHeight
              }px)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Preview;
