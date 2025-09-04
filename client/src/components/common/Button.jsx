import React from 'react';
import Loader from './Loader';
import '@/css/Button.css';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    onClick,
}) => {
    return (
        <button
            type={type}
            className={`btn btn-${variant} btn-${size} ${
                fullWidth ? 'btn-block' : ''
            }`}
            onClick={onClick}
            disabled={disabled || loading}>
            {loading ? <Loader size={22} color="#fff" /> : children}
        </button>
    );
};

export default Button;
