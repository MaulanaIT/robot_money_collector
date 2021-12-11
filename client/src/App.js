import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/home';

import './style.css';
import 'bootstrap/dist/css/bootstrap.css';

const React = require('react');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;
