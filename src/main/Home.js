import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container my-5">
            <h1>Welcome to our Face Recognition App</h1>
            <Link className="btn btn-outline-secondary my-3" to="/add-face">Add your Face</Link>
            <Link className="btn btn-outline-secondary my-3 ms-3" to="/recognize-face">Recognize your Face</Link>
        </div>
    );
}

export default Home;