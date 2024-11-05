import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from 'page/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
