import React, { useEffect } from "react";

const ResumeContext = React.createContext();

export const useResume = () => React.useContext(ResumeContext);

const ResumeProvider = ({ children }) => {
  const [values, setValues] = React.useState({
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
    },
    ...JSON.parse(localStorage.getItem("resume")),
  });
  const [resumeScore, setResumeScore] = React.useState(0);
  const [resumeTip, setResumeTip] = React.useState({
    desc: "",
    increment: 0,
  });
  const [loading, setLoading] = React.useState(false);

  const calculateResumeScore = () => {
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

  useEffect(() => {
    const data = localStorage.getItem("resume");
    if (data) {
      setValues((prev) => ({ ...prev, ...JSON.parse(data) }));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    localStorage.setItem("resume", JSON.stringify(values));
    calculateResumeScore();
    setLoading(false);
  }, [values]);

  const value = {
    values,
    handlePhoto,
    handleResumeChange,
    get,
    loading,
    setLoading,
    resumeScore,
    resumeTip,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};

export default ResumeProvider;
