import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const EnterScreen = ({ onEnter, show }: { onEnter: () => void, show: boolean }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black cursor-pointer"
          onClick={onEnter}
        >
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="text-slate-900 dark:text-white font-mono text-sm tracking-[0.3em] uppercase hover:text-red-500 transition-colors duration-300"
          >
            [ click to enter ]
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
