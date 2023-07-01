import React from "react";
import styles from "./ResumeBuilder.module.css";
import Preview from "./components/Preview/Preview";
import PreviewOptions from "./components/PreviewOptions/PreviewOptions";
import ISMResumeBuild from "./components/templates/ISM/ISMResumeBuild";
import DocumentMeta from "react-document-meta";

const ResumeBuilder = () => {
  const meta = {
    title: "Resume Builder",
    description: "Resume Builder - Made for ISM with 🧡 by @leafpetal",
  };

  return (
    <DocumentMeta {...meta}>
      <div className={styles.container}>
        <div className={styles.left}>
          <ISMResumeBuild />
        </div>
        <div className={styles.right}>
          <Preview />
          <PreviewOptions />
        </div>
      </div>
    </DocumentMeta>
  );
};

export default ResumeBuilder;
