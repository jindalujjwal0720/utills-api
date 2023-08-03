import React from "react";
import styles from "./ChooseTemplate.module.css";
import { useResume } from "../../context/Resume";

const ChooseTemplate = () => {
  const { templates, handleTemplateChange } = useResume();
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Build your official resume easily!</div>
      <div className={styles.templatesGrid}>
        {Object.values(templates).map((template, index) => {
          return (
            <div
              key={index}
              className={styles.template}
              onClick={() => handleTemplateChange(template.key)}
            >
              <div className={styles.preview}>
                <img src={template.preview} alt={template.name} />
              </div>
              <div className={styles.name}>{template.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChooseTemplate;
