"use client";

import { useState } from "react";
import { MessageSquarePlus, History, Settings, PanelLeftClose, PanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utils file, or I can inline it if needed. 
// Wait, I haven't checked for lib/utils. I'll stick to standard class string toggle or just inline it for now to be safe, 
// OR I'll create a simple helper in the file.

function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ className }: { className?: string }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Mobile Toggle (only visible when sidebar is closed/hidden) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={classNames(
                    "fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/50 text-white hover:bg-white/10 transition md:hidden",
                    isOpen ? "hidden" : "block"
                )}
            >
                <PanelLeft className="h-5 w-5" />
            </button>

            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={classNames(
                            "fixed inset-y-0 left-0 z-40 w-72 flex-col bg-black border-r border-white/10 md:relative md:flex",
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-4 h-16 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <span className="font-bold text-white text-xs">AI</span>
                                </div>
                                <span className="font-bold text-lg tracking-tight">WatchThis</span>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition md:hidden"
                            >
                                <PanelLeftClose className="h-4 w-4" />
                            </button>
                            {/* Desktop toggle button usually lives outside or we keep it fixed open on desktop for this design */}
                        </div>

                        {/* Main Actions */}
                        <div className="p-4 space-y-2">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition shadow-lg shadow-white/5 group">
                                <MessageSquarePlus className="h-4 w-4 transition group-hover:scale-110" />
                                New Chat
                            </button>
                        </div>

                        {/* Recent Chats Section */}
                        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                            <div className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 px-2">Recent Chats</div>

                            <div className="space-y-1">
                                {/* Mock Data */}
                                {["Sci-Fi Movies like Interstellar", "Funny 90s Comedies", "Best Horror of 2024", "Sad Romance Movies"].map((chat, i) => (
                                    <button
                                        key={i}
                                        className="w-full text-left truncate px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition flex items-center gap-3 group"
                                    >
                                        <History className="h-3.5 w-3.5 text-white/30 group-hover:text-white/60" />
                                        <span className="truncate">{chat}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/5">
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition">
                                <Settings className="h-4 w-4" />
                                Settings
                            </button>

                            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 relative overflow-hidden group cursor-pointer hover:border-white/10 transition">
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-indigo-300 mb-1">PRO PLAN</div>
                                    <div className="text-sm text-white/80 font-medium">Upgrade to Premium</div>
                                </div>
                                <div className="absolute -right-4 -bottom-4 h-16 w-16 bg-indigo-500/20 blur-xl group-hover:bg-indigo-500/30 transition" />
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
