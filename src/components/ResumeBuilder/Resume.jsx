import React from "react";
import { Route, Routes } from "react-router-dom";
import ResumeShowcase from "./showcase/ResumeShowcase";
import ResumeBuilder from "./builder/ResumeBuilder";
import ResumeProvider from "./builder/components/context/Resume";
import { Helmet } from "react-helmet";

const Resume = () => {
  return (
    <ResumeProvider>
      <Helmet>
        <title>Resume Builder</title>
        <meta
          name="description"
          content="Resume Builder - Made for ISM with 🧡 by @leafpetal"
        />
      </Helmet>
      <Routes>
        <Route path="/showcase" element={<ResumeShowcase />} />
        <Route path="/*" element={<ResumeBuilder />} />
      </Routes>
    </ResumeProvider>
  );
};

export default Resume;
