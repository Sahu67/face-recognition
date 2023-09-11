import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Navbar from './common/Navbar';
import Home from './main/Home';
import AddFace from './main/AddFace';
import RecognizeFace from './main/RecognizeFace';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-face" element={<AddFace />} />
        <Route path="/recognize-face" element={<RecognizeFace />} />
      </Routes>
    </Router>
  );
}

export default App;
