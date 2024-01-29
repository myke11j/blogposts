// TopUsers.js

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

import '../Style/App.css';

function TopUsers() {
    
    const [data, setCategories] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/api/public/posts/top/users')
        .then(res => res.json())
        .then(data => setCategories(data));
    }, []);

    return (
        <div className="blogs">
            {data && data.map(post => (
                <div className="blog-section" key={post._id}>
                    <h3>Author name: {post._id}</h3>
                    <div className="author-name details">
                        {post.count} posts published <FontAwesomeIcon icon={faMedal} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TopUsers;
