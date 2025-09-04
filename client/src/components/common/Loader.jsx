import React from 'react';

const Loader = ({ size = 24, color = '#fff' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            style={{ display: 'block' }}>
            <circle
                cx="50"
                cy="50"
                r="32"
                strokeWidth="8"
                stroke={color}
                strokeDasharray="50.26548245743669 50.26548245743669"
                fill="none"
                strokeLinecap="round">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="1s"
                    values="0 50 50;360 50 50"
                    keyTimes="0;1"
                />
            </circle>
        </svg>
    );
};

export default Loader;
