// MyPosts.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck, faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import PostEditModal from './PostEditModal';
import Pagination from './Pagination';
import '../Style/Blog.css';

const MyPosts = ({ jwtToken }) => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleEditClick = (post) => {
        // Show the modal and set the selected post for editing
        setEditModalVisible(true);
        setSelectedPost(post);
    };

    const handleEditModalSave = (editedPost) => {
        const payload = { ...editedPost, token: jwtToken }
        setEditModalVisible(false);
        setSelectedPost(null);
        editPost(payload);
    };
    
    const handleEditModalCancel = () => {
        // Close the modal without saving
        setEditModalVisible(false);
        setSelectedPost(null); // Reset selected post
    };

    useEffect(() => {
        fetch('http://localhost:4000/api/auth/posts/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${jwtToken}`, // Removed header based auth
                },
                body: JSON.stringify({ token: jwtToken }),
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setCurrentPage(data.currentPage)
                setTotalPages(data.totalPages)
                return setData(data.posts)
            });
    }, [jwtToken]);

    
    const handlePageChange = (page) => {
        fetch(`http://localhost:4000/api/auth/posts/all?page=${page}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: jwtToken }),
            })
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setCurrentPage(data.currentPage)
                setTotalPages(data.totalPages)
                return setData(data.posts)
            });
    };

    const handleDeleteClick = (id) => {
        try {
            fetch('http://localhost:4000/api/auth/posts', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: jwtToken, id }),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                navigate('/activity');
                return data;
            });
        } catch (error) {
          console.error('Error making API call:', error);
        }
    };

    const editPost = (payload) => {
        try {
            fetch('http://localhost:4000/api/auth/posts', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }).then((res) => {
                return res.json();
            }).then((data) => {
                navigate('/activity');
                return data;
            });
        } catch (error) {
          console.error('Error making API call:', error);
        }
    };
    

    return (
        <div className='my-posts'>
            <div className="blogs">
                {data && data.map(post => (
                    <div className="blog-section" key={post._id}>
                        <Link to={`/post/${post._id}`} key={post._id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <div className="details">Author: {post.author_name}</div>
                            <div className="details">Category: {post.category}</div>
                            <div className="details">
                                Published: {post.status === 0 ? <FontAwesomeIcon icon={faClock} /> : <FontAwesomeIcon icon={faCheck} />}
                            </div>
                        </Link>
                        <FontAwesomeIcon className='fa-icon' icon={faTrash} onClick={() => handleDeleteClick(post._id)} style={{ cursor: 'pointer' }} />
                        <FontAwesomeIcon className='fa-icon' icon={faEdit} onClick={() => handleEditClick(post)} style={{ cursor: 'pointer' }} />
                    </div>
                ))}
            </div>
            <button className="create-post-button">
                <FontAwesomeIcon icon={faPlusCircle} className="plus-icon" />
                <span>
                    <Link className='create-post-btn-txt' to={`/create-post`}>Create New Post</Link>
                </span>
            </button>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}></Pagination>

            {editModalVisible && selectedPost && (
                <PostEditModal
                post={selectedPost}
                onSave={handleEditModalSave}
                onCancel={handleEditModalCancel}
                categories={['Gaming', 'Art', 'Music', 'Movies', 'Anime', 'Work', 'Trending', 'Sports', 'Travel', 'Misc']}
                />
            )}
        </div>
    );
};

export default MyPosts;