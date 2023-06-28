import { Route, Routes } from "react-router-dom";
import "./App.css";
import RandomQuote from "./components/RandomQuotes/RandomQuote";

function App() {
  return (
    <Routes>
      <Route path="/random-quote" element={<RandomQuote />} />
    </Routes>
  );
}

export default App;
