import React, { useEffect, useRef, useState } from "react";
import styles from "./Preview.module.css";
import { useResume } from "../context/Resume";
import { htmlToCanvasImage } from "../../../utils/html_to_canvas_image";
import ISMResume from "../templates/ISM/ISMResume";

const Preview = () => {
  const { values } = useResume();
  const containerRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (values) {
      containerRef.current &&
        htmlToCanvasImage(containerRef.current).then((img) => {
          //   console.log(img);
          setImage(img);
        });
    }
  }, [values]);

  return (
    <div className={styles.preview}>
      {/* For only print purposes */}
      <div className={styles.print_only_resume_page}>
        <div ref={containerRef} className={styles.container}>
          <ISMResume sections={values.sections} />
        </div>
      </div>
      <div className={styles.preview_image}>
        {image && <img src={image} alt="Resume" />}
      </div>
    </div>
  );
};

export default Preview;
