import React from "react";
import styles from "./ResumeBuilder.module.css";
import Preview from "./components/Preview/Preview";
import PreviewOptions from "./components/PreviewOptions/PreviewOptions";
import ISMResumeBuild from "./components/templates/ISM/ISMResumeBuild";

const ResumeBuilder = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <ISMResumeBuild />
      </div>
      <div className={styles.right}>
        <Preview />
        <PreviewOptions />
      </div>
    </div>
  );
};

export default ResumeBuilder;
