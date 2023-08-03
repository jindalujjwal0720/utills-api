import React, { useEffect } from "react";
import ISMResumeBuild from "../templates/ISM/ISMResumeBuild";
import ISMResume from "../templates/ISM/ISMResume";
import ISMPreviewImage from "../../../assets/images/iitism_resume_preview.png";
import IITBResumeBuild from "../templates/IITB/IITBResumeBuild";
import IITBResume from "../templates/IITB/IITBResume";
import IITBPreviewImage from "../../../assets/images/iitb_resume_preview.png";

const ResumeContext = React.createContext();

export const useResume = () => React.useContext(ResumeContext);

const configResume = {
  name: "Untitled",
  sections: {
    profile: {
      name: "Profile",
      key: "sections.profile",
      data: {},
    },
    education: {
      name: "Education",
      key: "sections.education",
      data: [],
    },
    experience: {
      name: "Experience",
      key: "sections.experience",
      data: [],
    },
    projects: {
      name: "Projects",
      key: "sections.projects",
      data: [],
    },
    sportsProgramming: {
      name: "Sports Programming",
      key: "sections.sportsProgramming",
      data: [],
    },
    technicalSkills: {
      name: "Technical Skills",
      key: "sections.technicalSkills",
      data: [],
    },
    extraCurriculars: {
      name: "Extra Curriculars",
      key: "sections.extraCurriculars",
      data: [],
    },
    achievements: {
      name: "Achievements",
      key: "sections.achievements",
      data: [],
    },
    positionsOfResponsibility: {
      name: "Positions of Responsibility",
      key: "sections.positionsOfResponsibility",
      data: [],
    },
    awards: {
      name: "Awards",
      key: "sections.awards",
      data: [],
    },
    settings: {
      name: "Settings",
      key: "sections.settings",
      data: {},
    },
  },
};

const mergeDataIntoConfig = (data) => {
  // console.log(data);
  const config = { ...configResume };
  if (!data) return config;
  // for every key in config, get the data from data object
  // and merge it into config
  if (data.name) config.name = data.name;
  if (!data.sections) return config;
  for (let key in config.sections) {
    // check if data is object or list of objects
    if (!data.sections[key]) continue;
    if (Array.isArray(data.sections[key].data)) {
      let temp = true;
      data.sections[key].data.forEach((item) => {
        if (typeof item !== "object") {
          temp = false;
        }
      });
      if (temp) {
        config.sections[key] = data.sections[key];
      }
    } else if (typeof data.sections[key].data === "object") {
      config.sections[key] = data.sections[key];
    }
  }
  // console.log(config);
  return config;
};

const ResumeProvider = ({ children }) => {
  const templates = {
    iitism: {
      name: "IIT(ISM) Dhanbad",
      key: "iitism",
      build: ISMResumeBuild,
      resume: ISMResume,
      page_margins: "0.3in",
      preview: ISMPreviewImage,
    },
    iitb: {
      name: "IIT Bombay",
      key: "iitb",
      build: IITBResumeBuild,
      resume: IITBResume,
      page_margins: "0.5in",
      preview: IITBPreviewImage,
    },
  };
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [values, setValues] = React.useState(
    mergeDataIntoConfig(JSON.parse(localStorage.getItem("resume")))
  );
  const [resumeScore, setResumeScore] = React.useState(0);
  const [resumeTip, setResumeTip] = React.useState({
    desc: "",
    increment: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const printContainerRef = React.useRef(null);

  const calculateResumeScore = () => {
    if (!values) return;
    let score = 0;
    const { sections } = values;
    const scoreMap = [
      {
        name: "Profile",
        key: "profile",
        score: 10,
        fields: {
          name: 1,
          email: 1,
          photo: 3,
          phone: 1,
          githubUsername: 1,
          admissionNumber: 1,
          degree: 1,
          branch: 1,
        },
      },
      {
        name: "Education",
        key: "education",
        score: 10,
        length: 3,
      },
      {
        name: "Experience",
        key: "experience",
        score: 20,
        length: 1,
      },
      {
        name: "Projects",
        key: "projects",
        score: 15,
        length: 2,
      },
      {
        name: "Sports Programming",
        key: "sportsProgramming",
        score: 10,
        length: 2,
      },
      {
        name: "Technical Skills",
        key: "technicalSkills",
        score: 10,
        length: 4,
      },
      {
        name: "Extra Curriculars",
        key: "extraCurriculars",
        score: 5,
        length: 2,
      },
      {
        name: "Achievements",
        key: "achievements",
        score: 10,
        length: 2,
      },
      {
        name: "Positions of Responsibility",
        key: "positionsOfResponsibility",
        score: 10,
        length: 1,
      },
    ];
    let nextBestSection = "",
      nextBestSectionScore = 0;
    scoreMap.forEach((section) => {
      if (section.length) {
        const data = sections[section.key]?.data;
        if (!data) return;
        const sectionScore = (data.length * section.score) / section.length;
        score += Math.min(section.score, sectionScore);
        if (section.score - sectionScore > nextBestSectionScore) {
          nextBestSectionScore = section.score - sectionScore;
          nextBestSection = section.name;
        }
      } else if (section.fields) {
        const fields = section.fields;
        const data = sections[section.key].data;
        let sectionScore = 0;
        for (let field in fields) {
          if (data[field]) {
            sectionScore += fields[field];
          } else {
            if (nextBestSectionScore < fields[field]) {
              nextBestSectionScore = fields[field];
              nextBestSection = section.name;
            }
          }
        }
        score += Math.min(section.score, sectionScore);
      }
    });
    score = Math.round(score);
    setResumeScore(score);
    setResumeTip({
      desc: nextBestSection,
      increment: nextBestSectionScore,
    });
  };

  const handlePhoto = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    try {
      const result = await new Promise((resolve, reject) => {
        reader.onload = (e_1) => {
          resolve(e_1.target.result);
        };
        reader.onerror = (err) => {
          reject(err);
        };
      });
      setLoading(false);
      return result;
    } catch (err_1) {
      setLoading(false);
      return null;
    }
  };

  /**
   * Handles change in resume data
   * @param {String} field
   * @param {any} value
   * @returns {void}
   * @example
   * handleResumeChange("education.0.cgpa", "9.22")
   * this will change the cgpa of first education object to 9.22
   * handleResumeChange("education.0", {cgpa: "9.22"})
   * this will also change the cgpa of first education object to 9.22
   */
  const handleResumeChange = (field, value) => {
    setLoading(true);
    setValues((prev) => {
      let temp = prev;
      const navigate = field.split(".");
      navigate.forEach((key, index) => {
        if (index === navigate.length - 1) {
          if (Number.isInteger(parseInt(key))) {
            temp[parseInt(key)] = value;
          } else {
            temp[key] = value;
          }
        } else {
          if (Number.isInteger(parseInt(key))) {
            temp = temp[parseInt(key)];
          } else {
            temp = temp[key];
          }
        }
      });
      return { ...prev };
    });
    setLoading(false);
  };

  /**
   *
   * @param {String} field
   * @returns {any} value of that field in resume
   */
  const get = (field) => {
    const navigate = field.split(".");
    let temp = values;
    navigate.forEach((key) => {
      if (!temp) return null;
      if (Number.isInteger(parseInt(key))) {
        temp = temp[parseInt(key)];
      } else {
        temp = temp[key];
      }
    });
    return temp;
  };

  const handleTemplateChange = (templateKey) => {
    if (!templateKey) setSelectedTemplate(null);
    else setSelectedTemplate(templates[templateKey]);
  };

  useEffect(() => {
    const data = localStorage.getItem("resume");
    const template = localStorage.getItem("template");
    if (data) {
      setValues(mergeDataIntoConfig(JSON.parse(data)));
    }
    if (template) {
      setSelectedTemplate(templates[template]);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    localStorage.setItem("resume", JSON.stringify(values));
    if (selectedTemplate) {
      localStorage.setItem("template", selectedTemplate.key);
    }
    calculateResumeScore();
    setLoading(false);
  }, [values, selectedTemplate]);

  const value = {
    values,
    handlePhoto,
    handleResumeChange,
    get,
    loading,
    setLoading,
    resumeScore,
    resumeTip,
    templates,
    selectedTemplate,
    handleTemplateChange,
    printContainerRef,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};

export default ResumeProvider;
