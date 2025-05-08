import React from 'react';

interface LoadingSpinnerProps {
    size?: string; // Size of the spinner (e.g., "h-12 w-12" for a 12x12 size)
    color?: string; // Color of the spinner (e.g., "text-blue-500")
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'h-12 w-12', color = 'text-blue-500' }) => {
    return (
        <div className={`flex items-center justify-center ${size} mx-auto my-[25%]`}>
            <svg
                className={`animate-spin ${color}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 4.418 3.582 8 8 8v-4zm8-9.209V2c3.313 0 6 2.687 6 6h-4c0-1.104-.896-2-2-2z"
                ></path>
            </svg>
        </div>
    );
};

export default LoadingSpinner;
