import React from 'react';

export interface DialogueButtonProps {
    text: string;
    className?: string;
}

export const DialogueButton: React.FC<DialogueButtonProps> = ({ text, className = '' }) => {
    return (
        <div
            className={`
        relative
        inline-block
        bg-white
        rounded-3xl
        px-6 py-3
        md:px-8 md:py-4
        shadow-lg
        transition-all
        duration-300
        hover:shadow-xl
        hover:scale-[1.02]
        ${className}
      `}
        >
            <p className="text-gray-800 text-sm md:text-base lg:text-lg font-medium whitespace-normal break-words">
                {text}
            </p>

            {/* Optional: Add a small tail/pointer to make it look more like a speech bubble */}
            <div
                className="
          absolute 
          -bottom-2 
          left-8
          w-0 
          h-0 
          border-l-[12px] 
          border-l-transparent
          border-r-[12px] 
          border-r-transparent
          border-t-[12px] 
          border-t-white
          drop-shadow-sm
        "
            />
        </div>
    );
};

export default DialogueButton;
