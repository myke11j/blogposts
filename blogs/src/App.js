import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import MainPage from './components/MainPage';
import TopUsers from './components/TopUsers';
import MyPosts from './components/MyPosts';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import PostDetails from './components/PostDetails';
import PostsByCategory from './components/PostsByCategory';
import CreatePost from './components/CreatePost';

import './Style/App.css';

function App() {
  const [jwtToken, setJwtToken] = useState(null);

  const handleLogin = (token) => {
    setJwtToken(token);
  };

  const handleLogout = () => {
    setJwtToken(null);
  };

  return (
    <Router>
      <div className="App">
        <Header jwtToken={jwtToken} onLogout={handleLogout}/>
        <Sidebar />
        <div>
          <Routes>
            <Route index exact path="/" element={<MainPage/>} />
            <Route exact path="/activity" element={<MainPage/>}/>
            <Route exact path="/my-posts" element={<MyPosts jwtToken={jwtToken} />} />
            <Route exact path="/top-authors" element={<TopUsers/>} />
            <Route exact path="/post/:id" element={<PostDetails/>} />
            <Route exact path="/category/:name" element={<PostsByCategory/>} />
            <Route exact path="/login" element={<Login onLogin={handleLogin}/>} />
            <Route exact path="/register" element={<Register/>} />
            <Route exact path="/create-post" element={<CreatePost jwtToken={jwtToken} />} />
          </Routes>
        </div>
    </div>
    </Router>
  );
}

export default App;
