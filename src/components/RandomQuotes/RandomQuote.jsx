import React, { useEffect, useState, useRef } from "react";
import styles from "./RandomQuote.module.css";
import { useLocation, redirect } from "react-router-dom";
import { htmlToImage } from "../../utils/html_to_image";

const RandomQuote = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const theme = queryParams.get("theme");
  const [quote, setQuote] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => setQuote(data));
  }, []);

  useEffect(() => {
    if (quote.content) {
      htmlToImage(containerRef.current, `random-quote.png`).then((dataUrl) => {
        // this is the image data url
        console.log(dataUrl);
        console.log(
          "Copy this image from console and paste into a text file. Rename the file to .png"
        );
      });
    }
  }, [quote]);

  return (
    <div ref={containerRef} className={styles.container} data-theme={theme}>
      <p className={styles.quote}>{quote.content}</p>
      <p className={styles.author}>{quote.author}</p>
    </div>
  );
};

export default RandomQuote;
