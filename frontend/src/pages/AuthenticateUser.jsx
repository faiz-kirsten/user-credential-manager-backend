import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

// show the user the credential repo they are part of
const AuthenticateUser = () => {
    const [divisions, setDivisions] = useState([]);
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerSurname, setRegisterSurname] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerDivision, setRegisterDivision] = useState(
        "6580a0ba6783fd54f46cf1e3"
    );
    const [outcomeStatus, setOutcomeStatus] = useState("");
    const [outcomeMessage, setOutcomeMessage] = useState("");
    const [loading, setLoading] = useState(false);
    // React hook for navigation
    const navigate = useNavigate(); // used to navigate to the credential route

    // Function to handle user login by making a POST request to the server

    useEffect(() => {
        setLoading(true);
        getDivisions();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Prepare user information for the POST request
        const userInfo = {
            username: loginUsername,
            password: loginPassword,
        };

        try {
            // Request options for the update
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo),
            };

            // Fetch and update the job status
            const response = await fetch(
                `http://localhost:5555/access/login`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Handle login success or failure
            if (data.err) {
                setOutcomeStatus("fail");
                setOutcomeMessage(data.err);
                displayMessage();
                return;
            } else {
                setOutcomeStatus("success");
                setOutcomeMessage(`${data.message}`);
            }

            // Display the outcome message and set user token in local storage
            displayMessage();
            localStorage.setItem("token", data.token);

            // Redirect to the credential repository page after a delay
            setTimeout(() => {
                setLoading(false);
                navigate(`/credential-repo`);
            }, 2000);
        } catch (err) {
            // Handle errors and log them to the console
            console.log(err);
        }

        // Clear login form inputs
        setLoginUsername("");
        setLoginPassword("");
    };

    // Function to handle user registration by making a POST request to the server

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if required input fields are not empty
        if (
            registerName.trim().length === 0 ||
            registerSurname.trim().length === 0 ||
            registerPassword.trim().length === 0 ||
            registerDivision.trim().length === 0
        ) {
            return;
        }

        // Prepare user information for the POST request
        const userInfo = {
            name: registerName,
            surname: registerSurname,
            password: registerPassword,
            _divisionId: registerDivision,
        };

        try {
            // Request options for the update
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfo),
            };

            // Fetch and update the job status
            const response = await fetch(
                `http://localhost:5555/access/register`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Clear input fields and update loading status
            setRegisterName("");
            setRegisterPassword("");
            setRegisterSurname("");
            setRegisterDivision("6580a0ba6783fd54f46cf1e3");
            setLoading(false);
        } catch (err) {
            // Handle errors and log them to the console
            console.log(err);
        }
    };

    // Function to display a message outcome and automatically hide it after a delay

    const displayMessage = () => {
        // Get the message outcome element
        const messageOutcomeElement =
            document.querySelector(".message-outcome");

        // Display the element
        messageOutcomeElement.style.display = "block";

        // Hide the element after a delay
        setTimeout(() => {
            messageOutcomeElement.style.display = "none";
        }, 2000);
    };

    const getDivisions = async () => {
        try {
            // Fetch data from the specified endpoint using the provided token and user agent
            const response = await fetch(`http://localhost:5555/divisions`);

            // Throw an error if the response is not successful
            if (!response.ok) {
                throw Error("Did not receive expected data.");
            }

            // Parse the response data
            const data = await response.json();
            setDivisions(data.divisions);
            setLoading(false);
            // console.log(data.divisions[0]._organisationalUnitId.name);
        } catch (err) {
            // Handle errors and log them to the console
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className={`message-outcome ${outcomeStatus}`}>
                {outcomeMessage}
            </div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {/* <div className="demo-users-container">
                        <h3 className="authenticate-heading">Demo Users</h3>
                        <table className="demo-users">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Faiz342</td>
                                    <td>123</td>
                                    <td>admin</td>
                                </tr>
                                <tr>
                                    <td>Henry892</td>
                                    <td>123</td>
                                    <td>normal</td>
                                </tr>
                                <tr>
                                    <td>Jeffery951</td>
                                    <td>123</td>
                                    <td>management</td>
                                </tr>
                                <tr>
                                    <td>Peterson257</td>
                                    <td>123</td>
                                    <td>normal</td>
                                </tr>
                                <tr>
                                    <td>Peter276</td>
                                    <td>123</td>
                                    <td>admin</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> */}
                    <h2 className="authenticate-heading">Login</h2>
                    <form className="form-container" onSubmit={handleLogin}>
                        <div className="form-controllers">
                            <div className="form-controller">
                                <label
                                    htmlFor="login-name"
                                    className="form-label">
                                    Username:
                                </label>
                                <input
                                    placeholder="Enter your name"
                                    type="text"
                                    value={loginUsername}
                                    required
                                    name="login-name"
                                    className="form-input"
                                    onChange={(e) => {
                                        setLoginUsername(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-controller">
                                <label
                                    htmlFor="login-password"
                                    className="form-label">
                                    Password:
                                </label>
                                <input
                                    placeholder="Enter your password"
                                    type="password"
                                    required
                                    name="login-password"
                                    value={loginPassword}
                                    className="form-input"
                                    onChange={(e) => {
                                        setLoginPassword(e.target.value);
                                    }}
                                />
                            </div>
                            <input
                                type="submit"
                                value="Login"
                                className="form-submit-btn"
                            />
                        </div>
                    </form>

                    <h2 className="authenticate-heading">Register</h2>
                    <form className="form-container" onSubmit={handleRegister}>
                        <div className="form-controllers">
                            <div className="form-controller">
                                <label className="form-label">Name: </label>
                                <input
                                    placeholder="Enter your name"
                                    type="text"
                                    value={registerName}
                                    required
                                    className="form-input"
                                    onChange={(e) => {
                                        setRegisterName(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-controller">
                                <label className="form-label">Surname: </label>
                                <input
                                    placeholder="Enter your surname"
                                    type="text"
                                    value={registerSurname}
                                    className="form-input"
                                    required
                                    onChange={(e) => {
                                        setRegisterSurname(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-controller">
                                <label className="form-label">Password: </label>
                                <input
                                    placeholder="Enter your password"
                                    type="password"
                                    required
                                    value={registerPassword}
                                    className="form-input"
                                    onChange={(e) => {
                                        setRegisterPassword(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="form-controller">
                                <label className="form-label">Division:</label>
                                <select
                                    value={registerDivision}
                                    onChange={(e) =>
                                        setRegisterDivision(e.target.value)
                                    }
                                    className="form-input"
                                    required>
                                    {divisions.map((division, i) => (
                                        <option value={division._id} key={i}>
                                            {`${division._organisationalUnitId.name} -  ${division.name}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="submit"
                                value="Register"
                                className="form-submit-btn"
                            />
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default AuthenticateUser;
