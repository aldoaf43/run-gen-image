"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer = ({ isOpen, onClose, title, children }: DrawerProps) => {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm dark:bg-black/60"
          />

          {/* Drawer / Modal Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-3xl bg-white px-6 pb-8 pt-4 shadow-2xl md:inset-x-auto md:inset-y-4 md:right-4 md:w-full md:max-w-lg md:rounded-2xl dark:bg-zinc-950 dark:border dark:border-zinc-800"
          >
            {/* Handle for mobile */}
            <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-zinc-200 md:hidden dark:bg-zinc-800" />

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
