import { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const AddFace = () => {

    const videoRef = useRef();
    const canvasRef = useRef();


    // Load from useEffect
    useEffect(() => {
        startVideo();
        videoRef && loadModels();
    }, []);


    // Open your Face WebCam
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({video: true})
        .then((currentStream) => {
            videoRef.current.srcObject = currentStream;
        })
        .catch((err) => {
            console.log(err);
        });
    }

    // Load Models
    const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]).then(() => { detectMyFace(); });
    }

    const detectMyFace = () => {
        setInterval(async() => {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            console.log(detections);

            // Draw the face in webcam
            canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
            faceapi.matchDimensions(canvasRef.current, {
                width: 640,
                height: 480
            });

            const resized = faceapi.resizeResults(detections, {
                width: 640, 
                height: 480
            });

            faceapi.draw.drawDetections(canvasRef.current, resized);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
            faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
        }, 100);
    }


    return (
        <div className="container my-5">
            <h1>Add Your Face</h1>
            <div className="app-webcam-container my-3">
                <video className='app-webcam' crossOrigin='anonymous' ref={videoRef} autoPlay muted></video>
                <canvas className='app-webcam app-canvas' ref={canvasRef}></canvas>
            </div>
        </div>
    );
}

export default AddFace;