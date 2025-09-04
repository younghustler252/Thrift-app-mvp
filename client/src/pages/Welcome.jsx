import React, { useState } from 'react';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../css/welcome.css';

function Welcome() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);
    return (
        <div className="welcome">
            <div className="welcome-content">
                <h2>welcome to thriftly </h2>
                <p>save smart and earn big</p>
            </div>
        </div>
    );
}

export default Welcome;
