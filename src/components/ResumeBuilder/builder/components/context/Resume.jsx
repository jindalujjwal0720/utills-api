import React, { useEffect } from "react";

const ResumeContext = React.createContext();

export const useResume = () => React.useContext(ResumeContext);

const ResumeProvider = ({ children }) => {
  const [values, setValues] = React.useState(
    JSON.parse(localStorage.getItem("resume")) || {
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
      },
    }
  );
  const [resumeScore, setResumeScore] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const calculateResumeScore = () => {
    let score = 0;
    const { sections } = values;
    const scoreMap = {
      profile: 10,
      education: 10,
      experience: 10,
      projects: 10,
      sportsProgramming: 10,
      technicalSkills: 10,
      extraCurriculars: 10,
      achievements: 10,
    };
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
      console.log(temp);
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
      setValues(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    localStorage.setItem("resume", JSON.stringify(values));
    setLoading(false);
  }, [values]);

  const value = {
    values,
    handlePhoto,
    handleResumeChange,
    get,
    loading,
    setLoading,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};

export default ResumeProvider;
