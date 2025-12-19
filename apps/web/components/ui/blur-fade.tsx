"use client";

import { motion } from "framer-motion";

export function BlurFade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
