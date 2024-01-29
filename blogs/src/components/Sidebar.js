// Sidebar.js

import React, { useEffect, useState } from 'react';

import '../Style/Sidebar.css';
import { Link } from 'react-router-dom';

import { categories } from '../utils/constants.js'

function Sidebar() {

//   const [publishedCategories, setCategories] = useState([]);
//   useEffect(() => {
//       fetch('http://localhost:4000/api/public/posts/top/category')
//       .then(res => res.json())
//       .then(data => setCategories(data));
//   }, []);

  return (
      <div className="sidebar">
          {categories && categories.map(cat => (
              <Link key={cat} to={`/category/${cat}`}>{cat}</Link>
          ))}
      </div>
  );
}

export default Sidebar;
