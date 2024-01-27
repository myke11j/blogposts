// PostsByCategory.js

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilSquare } from '@fortawesome/free-solid-svg-icons';

const PostsByCategory = ({ match }) => {
    const { name } = useParams();

  const [posts, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/public/posts/category/${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const posts = await response.json();
        setPostDetails(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [name]);

  return (
    <div className="posts-by-category-container">
      <div className="blogs">
        {posts && posts.map(post => (
            <Link to={`/post/${post._id}`} key={post._id} className="blog-section">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <div className="author-name details">Author: {post.author_name} <FontAwesomeIcon icon={faPencilSquare} /></div>
            </Link>
        ))}
    </div>
    </div>
  );
};

export default PostsByCategory;
