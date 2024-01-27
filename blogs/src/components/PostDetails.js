// PostDetails.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import '../Style/PostDetails.css'

const PostDetails = ({ match }) => {
    const { id } = useParams();

  const [postDetails, setPostDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/public/posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post details');
        }

        const data = await response.json();
        setPostDetails(data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  return (
    
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        postDetails && (
          <div className="blog-post">
          <h2 className="blog-title">{postDetails[0].title}</h2>
          <p className="blog-content">
          {postDetails[0].content}
          </p>
          <div className="blog-meta">
            <span className="category">Category: {postDetails[0].category}</span>
            <span className="author">Author: {postDetails[0].author_name}</span>
          </div>
          </div>
        )
      )}
    </div>
  );
};

export default PostDetails;
