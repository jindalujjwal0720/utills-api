import React from "react";
import styles from "./PreviewOptions.module.css";
import previewStyles from "../Preview/Preview.module.css";
import { useResume } from "../context/Resume";
import { htmlToCanvasImage } from "../../../utils/html_to_canvas_image";
import { saveAs } from "file-saver";

const PreviewOptions = () => {
  const { loading, values } = useResume();

  const handleImageDownload = async () => {
    const imageBlob = await htmlToCanvasImage(
      document.body.querySelector(`.${previewStyles.print_only_resume_page}`)
    );
    saveAs(imageBlob, `${values.name}.png`);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {loading ? "Saving..." : "Saved!"}
        <button className={styles.option} onClick={handleDownloadPDF}>
          Print
        </button>
        <button className={styles.option} onClick={handleImageDownload}>
          Image
        </button>
      </div>
    </div>
  );
};

export default PreviewOptions;
