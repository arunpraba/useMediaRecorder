import React, { useRef } from "react";
import { useMediaRecorder } from "./useMediaRecorder";

const App = () => {
  const mediaRef = useRef(null);
  const audioFormat = "audio/mp3";
  const audioConstraints = { audio: true, video: false };
  const videoFormat = "video/mp4";
  const videoConstraints = { audio: true, video: true };
  const recordingType = "VIDEO_AND_AUDIO";

  const {
    audioDevices,
    videoDevices,
    startRecording,
    stopRecording,
    isRecording,
    mediaBlobUrl,
    error,
  } = useMediaRecorder({
    recordingType,
    format: audioFormat,
    ref: mediaRef.current,
    // constraints: audioConstraints,
  });

  if (error) {
    alert(error);
  }

  return (
    <div className="p-5">
      <div className="container mx-auto">
        <p className="text-3xl mb-5">Media Recording Hooks</p>

        <div className="inline-flex my-5">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            onClick={startRecording}
          >
            Start Recording
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full sm:w-1/1 md:w-1/4 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Choose a audio device
            </label>
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              {audioDevices.map(({ deviceId, label }) => (
                <option key={deviceId} value={deviceId}>
                  {label || `Default ${deviceId}`}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-1/1 md:w-1/4 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Choose a video device
            </label>
            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
              {videoDevices.map(({ deviceId, label }) => (
                <option key={deviceId} value={deviceId}>
                  {label || `Default ${deviceId}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="max-w-lg my-5 rounded overflow-hidden shadow-lg flex justify-center text-center relative">
          <video className="w-full h-full" ref={mediaRef}></video>
          {isRecording && (
            <div className="absolute right-0 top-0 m-3 flex items-center">
              <div className="rounded-full h-3 w-3 mr-2 flex bg-red-700"></div>
              <div className="text-xs">Recording</div>
            </div>
          )}
        </div>
        {recordingType === "VIDEO_AND_AUDIO" && mediaBlobUrl && (
          <div className="max-w-lg my-5 rounded overflow-hidden shadow-lg flex justify-center text-center relative">
            <video
              className="w-full h-full"
              src={mediaBlobUrl}
              controls
            ></video>
          </div>
        )}
        {recordingType === "AUDIO_ONLY" && mediaBlobUrl && (
          <div className="max-w-lg my-5 rounded overflow-hidden shadow-lg flex justify-center text-center relative">
            <audio
              className="w-full h-full"
              src={mediaBlobUrl}
              controls
            ></audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
