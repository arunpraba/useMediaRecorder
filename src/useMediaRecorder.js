import { useEffect, useState, useCallback } from "react";

/**
 * Documentation
 *
 * @description useMediaRecorder is custom hook Returns media recording functionalities
 *
 * @param {string}   recordingType
 * @param {string}   format
 * @param {object}   constraints
 * @param {HTMLElement}   ref
 *
 * @returns {string} recordingType
 * @returns {MediaStream} previewStream
 * @returns {MediaDevices} devices
 * @returns {MediaDevices} audioDevices
 * @returns {MediaDevices} videoDevices
 * @returns {Function} startRecording
 * @returns {Function} stopRecording
 * @returns {Boolean} isRecording
 * @returns {Blob} mediaBlobUrl
 * @returns {string} error: err
 */

window.stream = null;

const mediaDevices =
  navigator.mediaDevices ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

const RECORDING = "recording";
const VIDEO_AND_AUDIO = "VIDEO_AND_AUDIO";
const AUDIO_ONLY = "AUDIO_ONLY";
const VIDEO_ONLY = "VIDEO_ONLY";

let chunks = [];
export const useMediaRecorder = ({
  recordingType: type,
  format,
  constraints,
  ref,
}) => {
  const recordingType = type;
  const mediaElement = ref;
  const defaultConstraints = {
    audio:
      recordingType === VIDEO_AND_AUDIO || recordingType === AUDIO_ONLY
        ? false
        : false,
    video:
      recordingType === VIDEO_AND_AUDIO || recordingType === VIDEO_ONLY
        ? {
            exact: "environment",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          }
        : false,
  };

  const [devices, setDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [err, setErr] = useState(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const checkVideo = useCallback(async () => {
    try {
      if (!MediaRecorder || !mediaDevices.getUserMedia) {
        throw Error("Unsupported Browser");
      }
      const mediaStream = await mediaDevices.getUserMedia(
        constraints || defaultConstraints
      );
      if (ref) {
        mediaElement.srcObject = mediaStream;
        mediaElement.onloadedmetadata = () => {
          mediaElement.play();
        };
      }
      window.stream = mediaStream;
    } catch (error) {
      setErr(error.message);
    }
  });

  const startRecording = async () => {
    if (window.stream) {
      const recorder = new MediaRecorder(window.stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      recorder.start(10);
    }
  };

  const stopRecording = () => {
    const blob = new Blob(chunks, { type: format });
    if (mediaRecorder.state === RECORDING) {
      mediaRecorder.stop();
    }
    chunks = [];
    setIsRecording(false);
    window.stream = null;
    const url = URL.createObjectURL(blob);
    setMediaBlobUrl(url);
  };

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await mediaDevices.enumerateDevices();
        setAudioDevices(
          devices.filter((device) => device.kind === "audioinput")
        );
        setVideoDevices(
          devices.filter((device) => device.kind === "videoinput")
        );
        setDevices(devices);
      } catch (err) {
        setErr(err.message);
      }
    };
    getDevices();

    return () => {
      chunks = [];
      URL.revokeObjectURL();
    };
  }, []);

  useEffect(() => {
    chunks = [];
    checkVideo();
  }, [checkVideo]);

  return {
    recordingType,
    previewStream: window.stream,
    devices,
    audioDevices,
    videoDevices,
    startRecording,
    stopRecording,
    isRecording,
    mediaBlobUrl,
    error: err,
  };
};
