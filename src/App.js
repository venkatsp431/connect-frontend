import logo from "./logo.svg";
import "./App.css";
import ChatApp from "./Components/ChatApp";
// import { Switch } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ChatApp />} />
        <Route exact path="/login" element={<AuthPage />} />
      </Routes>
    </div>
  );
}

export default App;
