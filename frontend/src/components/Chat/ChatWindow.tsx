import { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { chatApi } from '../../api/client';
import { v4 as uuidv4 } from 'uuid';

interface Message {
    id: string;
    role: 'user' | 'agent';
    text: string;
    intent?: string;
    confidence?: number;
    escalated?: boolean;
}

export const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'agent', text: 'Hello! I am your Multi-Modal Support Agent. You can send me text, voice, or images.' }
    ]);
    const [sessionId] = useState(uuidv4());
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
    };

    const handleText = async (text: string) => {
        const userMsg: Message = { id: uuidv4(), role: 'user', text };
        addMessage(userMsg);
        setIsLoading(true);

        try {
            const res = await chatApi.sendText(sessionId, text);
            const data = res.data;
            addMessage({
                id: uuidv4(),
                role: 'agent',
                text: data.response_text,
                confidence: data.confidence_score,
                intent: data.intent,
                escalated: data.escalate_to_human
            });
        } catch (err) {
            console.error(err);
            addMessage({ id: uuidv4(), role: 'agent', text: "Error connecting to server." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoice = async (file: File) => {
        addMessage({ id: uuidv4(), role: 'user', text: "🎤 Sent an audio message..." });
        setIsLoading(true);
        try {
            const res = await chatApi.sendVoice(sessionId, file);
            const data = res.data;
            addMessage({
                id: uuidv4(),
                role: 'agent',
                text: data.response_text,
                confidence: data.confidence_score,
                intent: data.intent,
                escalated: data.escalate_to_human
            });
        } catch (err) {
            addMessage({ id: uuidv4(), role: 'agent', text: "Error processing audio." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImage = async (file: File, caption: string) => {
        addMessage({ id: uuidv4(), role: 'user', text: `📷 Sent an image... ${caption ? `\nCaption: ${caption}` : ''}` });
        setIsLoading(true);
        try {
            const res = await chatApi.sendImage(sessionId, file, caption);
            const data = res.data;
            addMessage({
                id: uuidv4(),
                role: 'agent',
                text: data.response_text,
                confidence: data.confidence_score,
                intent: data.intent,
                escalated: data.escalate_to_human
            });
        } catch (err) {
            addMessage({ id: uuidv4(), role: 'agent', text: "Error processing image." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto bg-dark border-x border-white/5 shadow-2xl">
            <header className="p-4 border-b border-white/10 bg-dark/95 backdrop-blur z-10 sticky top-0 flex items-center justify-between">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    Support Agent
                </h1>
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-gray-400">Online</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(m => (
                    <MessageBubble key={m.id} {...m} />
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm ml-2">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce delay-100">●</span>
                        <span className="animate-bounce delay-200">●</span>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <InputArea
                onSendText={handleText}
                onSendVoice={handleVoice}
                onSendImage={handleImage}
                isLoading={isLoading}
            />
        </div>
    );
};
