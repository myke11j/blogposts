// Blogs.js

import React, { useEffect, useState } from 'react';

import Pagination from './Pagination';
import '../Style/Blog.css';
import { Link } from 'react-router-dom';

function Blogs() {
    
    const [data, setData] = useState({ posts: [], currentPage: 1, pageSize: 20, totalPages: 1, totalCount: 0 });
    const { posts, currentPage, totalPages} = data

    useEffect(() => {
        fetch('http://localhost:4000/api/public/posts')
        .then((res) => res.json())
        .then((data) => setData(data));
    }, []);

    const handlePageChange = (page) => {
        fetch(`http://localhost:4000/api/public/posts?page=${page}`)
        .then((res) => res.json())
        .then((data) => setData(data));
    };

    return (
        <div>
            <div className="blogs">
                {posts && posts.map(post => (
                    <Link to={`/post/${post._id}`} key={post._id} className="blog-section">
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <div className="details">Author: {post.author_name}</div>
                        <div className="details">Category: {post.category}</div>
                    </Link>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}></Pagination>
        </div>
    );
}

export default Blogs;
