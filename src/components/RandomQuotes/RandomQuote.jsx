import React, { useEffect, useState, useRef } from "react";
import styles from "./RandomQuote.module.css";
import { useLocation, redirect } from "react-router-dom";
import { htmlToImage } from "../../utils/html_to_image";

const RandomQuote = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const theme = queryParams.get("theme");
  const uid = queryParams.get("uid");
  const [quote, setQuote] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (!uid) {
      throw new Error("uid is required");
    }
    fetch("https://api.quotable.io/random")
      .then((res) => res.json())
      .then((data) => setQuote(data));
  }, [uid]);

  useEffect(() => {
    if (quote.content) {
      htmlToImage(containerRef.current, `random-quotes/${uid}.png`).then(
        (dataUrl) => {
          // this is the image data url
          console.log(dataUrl);
          redirect(dataUrl);
        }
      );
    }
  }, [quote, uid]);

  return (
    <div ref={containerRef} className={styles.container} data-theme={theme}>
      <p className={styles.quote}>{quote.content}</p>
      <p className={styles.author}>{quote.author}</p>
    </div>
  );
};

export default RandomQuote;
