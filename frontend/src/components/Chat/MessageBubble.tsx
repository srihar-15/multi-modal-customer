import React from 'react';

interface MessageBubbleProps {
    role: 'user' | 'agent';
    text: string;
    confidence?: number;
    intent?: string;
    escalated?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ role, text, confidence, intent, escalated }) => {
    const isUser = role === 'user';

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 glass ${isUser ? 'bg-primary/20 border-primary/30' : 'bg-secondary/40 border-white/10'}`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isUser ? 'text-blue-300' : 'text-emerald-300'}`}>
                        {isUser ? 'You' : 'Agent'}
                    </span>
                    {intent && !isUser && (
                        <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">
                            {intent}
                        </span>
                    )}
                </div>

                <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>

                {!isUser && confidence !== undefined && (
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${confidence > 0.8 ? 'bg-green-500' : confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                            <span className="text-[10px] text-gray-500">Confidence: {(confidence * 100).toFixed(0)}%</span>
                        </div>
                        {escalated && (
                            <span className="text-[10px] text-red-400 font-bold uppercase border border-red-500/30 px-1 rounded">
                                Escalated
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
