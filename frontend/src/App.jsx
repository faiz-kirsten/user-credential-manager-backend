import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthenticateUser from "./pages/AuthenticateUser";

const App = () => {
    return (
        <div>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<AuthenticateUser />} />
                    <Route path="/credential-repo" element={<Home />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
