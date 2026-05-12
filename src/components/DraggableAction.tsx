import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface DraggableActionProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onToggle: () => void;
  size: number;
  opacity: number;
  initialX?: number;
  initialY?: number;
}

export const DraggableAction: React.FC<DraggableActionProps> = ({ 
  label, 
  icon: Icon, 
  isActive,
  onToggle,
  size,
  opacity,
  initialX = 50,
  initialY = 50
}) => {
  const handleClick = () => {
    onToggle();
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: initialX, y: initialY }}
      whileDrag={{ 
        scale: 1.1,
        backgroundColor: "rgba(0, 255, 0, 0.8)",
        color: "#000"
      }}
      className="fixed z-50 rounded-2xl flex flex-col items-center justify-center cursor-move draggable-handle select-none"
      style={{
        width: size,
        height: size,
        opacity: opacity / 100,
        backgroundColor: isActive ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)",
        boxShadow: isActive ? "0 0 20px rgba(0, 255, 0, 0.6)" : "0 0 15px rgba(255, 0, 0, 0.4)",
        transition: "background-color 0.3s, box-shadow 0.3s"
      }}
      onClick={handleClick}
    >
      <Icon size={size * 0.4} className={isActive ? "text-black" : "text-white"} />
      <span className={`text-[10px] font-bold mt-1 uppercase ${isActive ? "text-black" : "text-white"}`}>
        {label}
      </span>
      
      {/* Visual feedback animation on tap */}
      {isActive && (
        <motion.div
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-brand-green rounded-2xl"
        />
      )}
    </motion.div>
  );
};
