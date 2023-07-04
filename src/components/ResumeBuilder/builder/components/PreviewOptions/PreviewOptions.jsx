import React from "react";
import styles from "./PreviewOptions.module.css";
import previewStyles from "../Preview/Preview.module.css";
import { useResume } from "../context/Resume";
import { htmlToCanvasImage } from "../../../utils/html_to_canvas_image";
import { saveAs } from "file-saver";

const PreviewOptions = () => {
  const { loading, values } = useResume();
  const handlePrintPDF = () => {
    const newWindow = window.open("", "_blank");
    const stylesheets = document.styleSheets;
    const styles = Array.from(stylesheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.log(e);
          return null;
        }
      })
      .join("\n");
    // const html = document.querySelector("html").outerHTML;
    const head = document.querySelector("head").outerHTML;
    const body = document.body.querySelector(
      `.${previewStyles.print_only_resume_page}`
    ).innerHTML;
    const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        ${head}
        <style>
            ${styles}
        </style>
    </head>
    <body>
        <div id="root">
            ${body}
        </div>
    </body>
    </html>
    `;
    newWindow.document.write(content);
    newWindow.document.close();
    newWindow.addEventListener("afterprint", () => {
      newWindow.close();
    });
    // print the window after load
    newWindow.onload = () => {
      newWindow.print();
    };
  };

  const handleImageDownload = async () => {
    const imageBlob = await htmlToCanvasImage(
      document.body.querySelector(`.${previewStyles.print_only_resume_page}`)
    );
    saveAs(imageBlob, `${values.name}.png`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {loading ? "Saving..." : "Saved!"}
        <button className={styles.option} onClick={handlePrintPDF}>
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
