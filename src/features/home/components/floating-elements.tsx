"use client";

import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Hash } from "lucide-react";
export const FloatingTransactionCard = ({
  amount,
  donor,
  positionClasses,
  delay,
  icon,
}: {
  amount: string;
  donor: string;
  positionClasses: string;
  delay: number;
  icon: React.ReactNode;
}) => (
  <motion.div
    className={`absolute ${positionClasses} bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border border-white/20 rounded-xl px-3 py-2 text-xs shadow-lg z-20`}
    initial={{ opacity: 0, y: 50, scale: 0.8 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: [50, 0, -20, -50],
      scale: [0.8, 1, 1, 0.8],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-6 h-6 bg-green-400/20 rounded-full">
        {icon}
      </div>
      <div>
        <div className="text-white font-semibold">{amount}</div>
        <div className="text-gray-300 text-[10px]">{donor}</div>
      </div>
    </div>
  </motion.div>
);
export const BlockHashIndicator = ({
  positionClasses,
  delay,
}: {
  positionClasses: string;
  delay: number;
}) => {
  const [randomHash, setRandomHash] = useState<string | null>(null);
  useEffect(() => {
    setRandomHash(Math.random().toString(16).substr(2, 6));
  }, []);

  return (
    <motion.div
      className={`absolute ${positionClasses} bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg border border-purple-400/30 rounded-lg px-2 py-1 text-[10px] z-20`}
      initial={{ opacity: 0, x: -30 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [-30, 0, 0, 30],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <div className="flex items-center gap-1">
        <Hash className="w-3 h-3 text-purple-300" />
        <span className="text-purple-200 font-mono">
          {randomHash ? `0x${randomHash}` : "0x......"}
        </span>
      </div>
    </motion.div>
  );
};
export const FloatingIcon = ({
  imgSrc,
  altText,
  positionClasses,
  animationVariant,
}: {
  imgSrc: string;
  altText: string;
  positionClasses: string;
  animationVariant: Variants;
}) => (
  <motion.div
    className={`absolute w-16 h-16 p-3 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-xl ${positionClasses}`}
    variants={animationVariant}
    animate="animate"
  >
    <Image src={imgSrc} alt={altText} width={40} height={40} className="object-contain" />
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
);
export const Sparkle = ({
  positionClasses,
  duration,
}: {
  positionClasses: string;
  duration: number;
}) => (
  <motion.div
    className={`absolute w-1 h-1 bg-white rounded-full ${positionClasses}`}
    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
  />
);
