'use client'

import { motion } from 'framer-motion'
import React from 'react' 
const BlockchainNetwork = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-20">
        <motion.circle
          cx="20%"
          cy="30%"
          r="3"
          fill="#00F2DE"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle
          cx="80%"
          cy="25%"
          r="2"
          fill="#0EA5E9"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.circle
          cx="60%"
          cy="70%"
          r="2.5"
          fill="#8B5CF6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="15%"
          cy="80%"
          r="2"
          fill="#10B981"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
        />
        <motion.circle
          cx="90%"
          cy="60%"
          r="2"
          fill="#F59E0B"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
        />
        <motion.circle
          cx="40%"
          cy="20%"
          r="1.5"
          fill="#EF4444"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: 0.8 }}
        />
        <motion.line
          x1="20%"
          y1="30%"
          x2="80%"
          y2="25%"
          stroke="url(#gradient1)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.line
          x1="80%"
          y1="25%"
          x2="60%"
          y2="70%"
          stroke="url(#gradient2)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.line
          x1="60%"
          y1="70%"
          x2="15%"
          y2="80%"
          stroke="url(#gradient3)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
        />
        <motion.line
          x1="40%"
          y1="20%"
          x2="80%"
          y2="25%"
          stroke="url(#gradient4)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 3 }}
        />
        <motion.line
          x1="90%"
          y1="60%"
          x2="60%"
          y2="70%"
          stroke="url(#gradient5)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, delay: 1.2 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F2DE" stopOpacity="0" />
            <stop offset="50%" stopColor="#00F2DE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BlockchainNetwork;