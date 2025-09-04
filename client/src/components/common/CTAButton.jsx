// components/common/CTAButton.jsx
import React from 'react';
import '@/css/CTAButton.css';

function CTAButton({ icon: Icon, label, onClick }) {
    return (
        <button className="cta-btn" onClick={onClick}>
            <Icon className="cta-icon" />
            <label className="cta-label">{label}</label>
        </button>
    );
}

export default CTAButton;
