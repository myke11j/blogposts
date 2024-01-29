// CreatePost.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { categories } from '../utils/constants.js'

import "../Style/CreatePost.css"

const CreatePost = ({ jwtToken }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        published: false,
        token: jwtToken
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
            setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    const handleRadioChange = (e) => {
        const { name } = e.target;
        const checked = name === 'published'
        setFormData({
          ...formData,
          ['published']: checked
        });
    };

  const handleCreate = async () => {
    try {
        if (!formData.title || !formData.content || !formData.category) {
            console.error('Please fill in all required fields.');
            return;
        }

      const response = await fetch('http://localhost:4000/api/auth/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/activity');
      } else {
        console.error('Actions failed');
      }
    } catch (error) {
      console.error('Error during creating new post:', error);
    }
  };

  return (
    <div className="create-new-post-form">
      <h2>Create new Blog Post</h2>
      <form className="login-form">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
        />

      <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Publish:</label>
        <div>
          <input
            type="radio"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleRadioChange}
          />
          <label htmlFor="published">Yes</label>
        </div>

        <div>
          <input
            type="radio"
            id="not-published"
            name="not-published"
            checked={!formData.published}
            onChange={handleRadioChange}
          />
          <label htmlFor="not-published">No</label>
        </div>

        <button type="button" onClick={handleCreate}>
          Create <FontAwesomeIcon icon={faPlusCircle} />
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
