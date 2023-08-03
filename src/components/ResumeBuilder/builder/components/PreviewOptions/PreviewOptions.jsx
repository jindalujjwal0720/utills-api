import React from "react";
import styles from "./PreviewOptions.module.css";
import { useResume } from "../context/Resume";
import { htmlToCanvasImage } from "../../../utils/html_to_canvas_image";
import { saveAs } from "file-saver";
import { BiCloudDownload } from "react-icons/bi";
import { BiImage } from "react-icons/bi";

const PreviewOptions = () => {
  const {
    loading,
    values,
    selectedTemplate,
    printContainerRef,
    handleTemplateChange,
  } = useResume();

  const handleImageDownload = async () => {
    const imageBlob = await htmlToCanvasImage(printContainerRef.current);
    saveAs(imageBlob, `${values.name}.png`);
  };

  const handleDownloadPDF = () => {
    // add page margins to the @page css and a4 size
    const pageMargins = selectedTemplate.page_margins;
    const style = document.createElement("style");
    style.innerHTML = `@page { margin: ${pageMargins} !important; size: A4 !important; }`;
    const printContent = document.getElementById("print_content");
    printContent.style.width = `calc(210mm - 2 * ${pageMargins})`;
    const originalPadding = printContainerRef.current.style.padding;
    printContainerRef.current.style.padding = "0";
    document.head.appendChild(style);
    window.print();
    // remove the style tag
    style.remove();
    // reset the print content padding
    printContent.style.width = "100%";
    printContainerRef.current.style.padding = originalPadding;
  };

  const handleChangeTemplate = () => {
    handleTemplateChange();
  };

  return (
    <div className={styles.container}>
      <div className={styles.options}>
        <span className={styles.saved_state}>
          {loading ? "Saving..." : "Saved!"}
        </span>
        <span className={styles.text_option} onClick={handleChangeTemplate}>
          Change Template
        </span>
        <button className={styles.option} onClick={handleDownloadPDF}>
          <BiCloudDownload size={24} />
        </button>
        <button className={styles.option} onClick={handleImageDownload}>
          <BiImage size={24} />
        </button>
      </div>
    </div>
  );
};

export default PreviewOptions;
