import { useRef, useEffect } from "react";
import * as faceapi from 'face-api.js';

const RecognizeFace = () => {

    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        startVideo();
        videoRef && loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({video: true})
        .then(currentStream => {
            videoRef.current.srcObject = currentStream;
        })
        .catch(err => {
            console.log(err);
        });
    }

    const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]).then(() => {
            detectMyFace();
        });
    }

    const detectMyFace = () => {
        setInterval(async() => {
            const detections = await faceapi.detectAllFaces(videoRef.current, 
                new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceExpressions();

            console.log(detections);``

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
        <div className="container my-4">
            <h1>Recognize your face</h1>
            <div className="app-webcam-container">
                <video 
                    className="app-webcam"
                    crossOrigin="anonymous"
                    ref={videoRef}
                    autoPlay  
                    muted
                />
                <canvas ref={canvasRef} className="app-webcam" />
            </div>
        </div>
    );
}

export default RecognizeFace;