class SpeechService:
    def __init__(self):
        pass

    async def transcribe(self, audio_file) -> str:
        """
        Mock Whisper transcription.
        """
        return "This is a simulated transcription of the uploaded audio."
