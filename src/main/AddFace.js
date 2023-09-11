import { useCallback, useState, useRef } from "react";
import Webcam from "react-webcam";

const AddFace = () => {

    const [img, setImg] = useState(null);
    const [webcamDisplay, setWebcamDisplay] = useState('none');
    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 420,
        height: 420,
        facingMode: 'user'
    }

    const captureImg = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImg(imageSrc);
        setWebcamDisplay('none');
    }, [webcamRef]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://localhost/remote-server/add-data.php', true);

        xhr.onload = () => {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200) {
                    const data = xhr.response;
                    if(data === 'success') {
                        setImg(null);
                        setWebcamDisplay('none');
                        e.target.reset();
                        alert('Successfully added the data');
                        return;
                    } 
                    alert(data);
                }
            }
        }

        const formData = new FormData(e.target);
        formData.append('img', img);
        xhr.send(formData);
    }

    return (
        <div className="container my-5">
            <h1>Add Your Details</h1>
            <form action="#" id="add-details-form" className="my-4" encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" placeholder="..." />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="..." />
                </div>

                {img === null ? (
                    <>
                        <div className="mb-3" style={{
                            display: `${webcamDisplay === 'none' ? 'block' : 'none'}`
                        }}>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => { (webcamDisplay === 'none' ? setWebcamDisplay('block') : setWebcamDisplay('none')) }}>Capture your image</button>
                        </div>

                    </>
                ) : (
                    <>
                        <div className="mb-3" style={{ display: `${webcamDisplay === 'none' ? 'block' : 'none'}` }}>
                            <img src={img} width={400} height={400} style={{ objectFit: 'cover' }} alt="hello" />
                        </div>
                        <button type="button" style={{ display: `${webcamDisplay === 'none' ? 'block' : 'none'}` }} className="btn btn-outline-secondary mb-4" onClick={() => setWebcamDisplay('block')}>Recapture your image</button>
                    </>
                )}
                <div className="mb-3" style={{ display: webcamDisplay }}>
                    <Webcam
                        style={{
                            width: '100%',
                            height: '400px',
                            maxWidth: '400px'
                        }}
                        ref={webcamRef}
                        imageSmoothing={true}
                        audio={false}
                        mirrored={true}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                    />
                    <div className="btns">
                        <button type="button" className="btn btn-outline-success me-2" onClick={captureImg}>Capture</button>
                        <button type="button" className="btn btn-outline-danger" onClick={() => { setWebcamDisplay('none'); }}>Close</button>
                    </div>
                </div>

                {/* <input type="file" name="file" id="sp-file" /> */}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default AddFace;