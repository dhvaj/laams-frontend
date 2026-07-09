import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  definition: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, definition }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <button 
        className="font-bold text-primary underline decoration-dotted underline-offset-4 focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
        aria-describedby={`tooltip-${text}`}
        aria-expanded={isVisible}
      >
        {text}
      </button>
      
      {isVisible && (
        <span 
          id={`tooltip-${text}`}
          role="tooltip"
          className="absolute z-10 w-64 p-3 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 dark:bg-gray-100 dark:text-gray-900"
        >
          {definition}
          {/* Arrow */}
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900 dark:border-t-gray-100"></span>
        </span>
      )}
    </span>
  );
};
