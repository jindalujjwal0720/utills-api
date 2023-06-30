import React from "react";
import { Route, Routes } from "react-router-dom";
import ResumeShowcase from "./showcase/ResumeShowcase";
import ResumeBuilder from "./builder/ResumeBuilder";
import ResumeProvider from "./builder/components/context/Resume";

const Resume = () => {
  return (
    <ResumeProvider>
      <Routes>
        <Route path="/showcase" element={<ResumeShowcase />} />
        <Route path="/*" element={<ResumeBuilder />} />
      </Routes>
    </ResumeProvider>
  );
};

export default Resume;
