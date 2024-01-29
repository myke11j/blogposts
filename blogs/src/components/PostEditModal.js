import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import "../Style/CreatePost.css"

const PostEditModal = ({ post, onSave, onCancel, categories }) => {

  const [formData, setFormData] = useState({
        id: post._id,
        title: post.title,
        content: post.content,
        category: post.category,
        published: post.status
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { name } = e.target;
    const checked = name === 'published'
    setFormData({ ...formData, ['published']: checked });
};

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="modal create-new-post-form">
        <h2>Edit Post</h2>
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
              name="not published"
              checked={!formData.published}
              onChange={handleRadioChange}
            />
            <label htmlFor="not-published">No</label>
          </div>

          <button type="button" onClick={handleSave}>
            <FontAwesomeIcon icon={faPlusCircle} /> Save
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
    </div>
  );
};

export default PostEditModal;
