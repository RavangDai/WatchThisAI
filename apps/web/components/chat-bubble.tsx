import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ChatBubbleProps {
    message: string;
    isThinking?: boolean;
}

export default function ChatBubble({ message, isThinking = false }: ChatBubbleProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-3xl mx-auto mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
        >
            <div className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                <Sparkles className="h-5 w-5 text-white fill-white/20" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">
                    WatchThis AI
                </div>
                {isThinking ? (
                    <div className="flex items-center gap-1 h-6">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"></span>
                    </div>
                ) : (
                    <p className="text-white/90 leading-relaxed text-lg font-light">
                        {message}
                    </p>
                )}
            </div>
        </motion.div>
    );
}
