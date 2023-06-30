import React from "react";
import styles from "./PreviewOptions.module.css";
import previewStyles from "../Preview/Preview.module.css";
import { useResume } from "../context/Resume";

const PreviewOptions = () => {
  const { loading } = useResume();
  const handleDownloadPDF = () => {
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
        }
      })
      .join("\n");
    const html = document.querySelector("html").outerHTML;
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
    newWindow.print();
    newWindow.addEventListener("afterprint", () => {
      newWindow.close();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {loading ? "Saving..." : "Saved!"}
        <button className={styles.option} onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PreviewOptions;
