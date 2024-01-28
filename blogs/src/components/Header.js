// Header.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from 'react-router-dom';
import { faCommenting } from "@fortawesome/free-solid-svg-icons";

import '../Style/Header.css'

function Header({ jwtToken, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/activity');
    };

    return (
        <header className="header">
            <div className="top-bar">
                <div className="left-section">
                    <h1 className="left-section-tab">What's new blogs</h1>
                    <FontAwesomeIcon className="left-section-tab" icon={faCommenting} />
                    <div>
                    {jwtToken ? (
                        <div className="left-section-tab">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div className="left-section-tab">
                            <button>
                                <Link to="/login">Login</Link>
                            </button>
                            <button>
                                <Link to="/register">Register</Link>
                            </button>
                        </div>
                    )}
                    </div>
                </div>
                <div className="right-section">
                    <div className="right-section-tab">
                        <Link to='/activity'>Latest Activity</Link>
                    </div>
                    <div className="right-section-tab">
                        {jwtToken ? (<Link to='/my-posts'>My Posts</Link>) : (<Link to='/login'>My Posts</Link>)}
                        
                    </div>
                    <div className="right-section-tab">
                        <Link to='/top-authors'>Top Authors</Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;