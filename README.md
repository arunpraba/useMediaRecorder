#  useMediaRecorder | Custom Hook


useMediaRecorder is custom hook Returns media recording functionalities



```js
  Params

  @param {string}   recordingType
  @param {string}   format
  @param {object}   constraints
  @param {HTMLElement}   ref
  
  ```
  
  
```js
 
  Returns
  
  @returns {string} recordingType
  @returns {MediaStream} previewStream
  @returns {MediaDevices} devices
  @returns {MediaDevices} audioDevices
  @returns {MediaDevices} videoDevices
  @returns {Function} startRecording
  @returns {Function} stopRecording
  @returns {Boolean} isRecording
  @returns {Blob} mediaBlobUrl
  @returns {string} error: err

```
