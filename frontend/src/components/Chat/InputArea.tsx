import { useState, useRef } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon, PhotoIcon } from '@heroicons/react/24/solid';

interface InputAreaProps {
    onSendText: (text: string) => void;
    onSendVoice: (file: File) => void;
    onSendImage: (file: File, caption: string) => void;
    isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendText, onSendVoice, onSendImage, isLoading }) => {
    const [text, setText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || isLoading) return;
        onSendText(text);
        setText('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onSendImage(e.target.files[0], text);
            setText('');
        }
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            setTimeout(() => {
                setIsRecording(false);
                alert("Mock Voice Recording finished.");
                // Mock sending a file
                const mockAudio = new File([""], "voice.mp3", { type: "audio/mp3" });
                onSendVoice(mockAudio);
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 glass rounded-t-2xl border-t border-white/10 bg-dark/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition"
                    title="Upload Image"
                >
                    <PhotoIcon className="w-6 h-6" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />

                <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-2 rounded-full hover:bg-white/10 transition ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
                    title="Voice Message"
                >
                    <MicrophoneIcon className="w-6 h-6" />
                </button>

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-4 py-2 outline-none"
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading || !text.trim()}
                    className="p-2 rounded-full bg-primary hover:bg-blue-500 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </form>
    );
};
