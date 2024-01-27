// Sidebar.js

import React, { useEffect, useState } from 'react';

import '../Style/Sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar() {

  const [categories, setCategories] = useState([]);
  useEffect(() => {
      fetch('http://localhost:4000/api/public/posts/top/category')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
      <div className="sidebar">
          {categories && categories.map(cat => (
              <Link to={`/category/${cat._id}`}>{cat._id}</Link>
          ))}
      </div>
  );
}

export default Sidebar;
