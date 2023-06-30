import { Route, Routes } from "react-router-dom";
import "./App.css";
import RandomQuote from "./components/RandomQuotes/RandomQuote";
import Resume from "./components/ResumeBuilder/Resume";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Utills API</h1>} />
      <Route path="/random-quote" element={<RandomQuote />} />
      <Route path="/resume/*" element={<Resume />} />
    </Routes>
  );
}

export default App;
