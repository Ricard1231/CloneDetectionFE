import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Home from './Home'
import Login from './Login';
import Register from './Register';

function App() {
  const [token, setToken] = useState(null);
  const [resetHome, setResetHome] = useState(new Date());

  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path='/' element={<Home token={token} key={resetHome} setResetHome={setResetHome} setToken={setToken} />} />
            <Route path='/login' element={<Login setToken={setToken} />} />
            <Route path='/register' element={<Register setToken={setToken} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
