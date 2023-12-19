import React from "react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [credentialRepoInfo, setCredentialRepoInfo] = useState([]);
    const [users, setUsers] = useState([]);
    // const edit form state
    const [editPlatform, setEditPlatform] = useState("");
    const [editCredentialPassword, setEditCredentialPassword] = useState("");
    const [editCredentialId, setEditCredentialId] = useState("");
    const [editUserRole, setEditUserRole] = useState("");
    const [editUserDivision, setEditUserDivision] = useState("");
    const [editUserId, setEditUserId] = useState("");
    // create user form input state
    const [createPlatform, setCreatePlatform] = useState("");
    const [createUserPassword, setCreateUserPassword] = useState("");
    const [divisions, setDivisions] = useState([]);
    const navigate = useNavigate(); // used to navigate to the credential route

    const fetchCredentialRepo = async () => {
        try {
            // Fetch data from the specified endpoint using the provided token and user agent
            const response = await fetch(
                `http://localhost:5555/divisions/division/credential-repo`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "User-Agent": "client",
                    },
                }
            );

            // Throw an error if the response is not successful
            if (!response.ok) {
                throw Error("Did not receive expected data.");
            }

            // Parse the response data
            const data = await response.json();
            console.log(data, "data");
            // Set the current user's role and update user data state variables
            setCredentialRepoInfo(data);
            fetchUsers();
            getDivisions();
        } catch (err) {
            // Handle errors and log them to the console
            console.log(err);
        }
    };
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch data from the specified endpoint using the provided token and user agent
            const response = await fetch(`http://localhost:5555/users`);

            // Throw an error if the response is not successful
            if (!response.ok) {
                throw Error("Did not receive expected data.");
            }

            // Parse the response data
            const data = await response.json();
            setUsers(data.users);
            setLoading(false);
        } catch (err) {
            // Handle errors and log them to the console
            console.log(err);
        }
    };

    // UseEffect hook to trigger the fetchCredentialRepo function once on component mount
    useEffect(() => {
        fetchCredentialRepo();
    }, []);

    // handle log out
    const handleLogOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Function to open the create user form modal

    const openCreateForm = () => {
        // Get the create user form modal element
        const createFormModalElement =
            document.querySelector("#create-user-modal");

        // Display the modal
        createFormModalElement.showModal();
    };

    // Function to close the create user form modal

    const closeCreateForm = () => {
        // Get the create user form modal element
        const createFormModalElement =
            document.querySelector("#create-user-modal");

        // Close the modal
        createFormModalElement.close();
    };

    const handleAddCredential = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if required input fields are not empty
        if (
            createPlatform.trim().length === 0 ||
            createUserPassword.trim().length === 0
        ) {
            return;
        }

        // Prepare user information for the POST request
        const credentialInfo = {
            platform: createPlatform,
            password: createUserPassword,
            _divisionId: credentialRepoInfo.currentUser._divisionId,
            _userId: credentialRepoInfo.currentUser._id,
        };

        try {
            // Request options for the update
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentialInfo),
            };

            // Make a POST request to the server's registration endpoint
            const response = await fetch(
                `http://localhost:5555/divisions/division/credential-repo/credential/add`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Clear input fields and update loading status
            setCreatePlatform("");
            setCreateUserPassword("");

            // Trigger a refresh of the credential repository data
            fetchCredentialRepo();
        } catch (err) {
            // Handle errors and log them to the console
            console.log(err);
        }
    };

    const openUserProfile = () => {
        const userProfileModalElement =
            document.querySelector("#user-profile-info");

        userProfileModalElement.showModal();
    };

    const closeUserProfile = () => {
        const userProfileModalElement =
            document.querySelector("#user-profile-info");

        userProfileModalElement.close();
    };

    // edit user credential
    const openEditForm = (credential) => {
        setEditPlatform(credential.platform);
        setEditCredentialPassword(credential.password);
        setEditCredentialId(credential._id);

        const createFromModalElement = document.querySelector(
            "#edit-credential-modal"
        );

        createFromModalElement.showModal();
    };

    const closeEditForm = () => {
        const createFromModalElement = document.querySelector(
            "#edit-credential-modal"
        );

        createFromModalElement.close();
    };

    // edit form
    const handleEditCredential = async (e) => {
        e.preventDefault();
        setLoading(true);
        const credentialInfo = {
            platform: editPlatform,
            password: editCredentialPassword,
        };

        try {
            // Request options for the update
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(credentialInfo),
            };

            // Fetch and update the job on the server
            const response = await fetch(
                `http://localhost:5555/divisions/division/credential-repo/credential/${editCredentialId}/update`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Update loading status and navigate back to the main route
            fetchCredentialRepo();
        } catch (err) {
            // Handle errors and update loading status
            setLoading(false);
            console.log(err);
        }
    };

    // update user role
    const openUpdateRoleForm = (user) => {
        setEditUserRole(user.role);
        setEditUserId(user._id);
        const createFromModalElement =
            document.querySelector("#edit-role-form");

        createFromModalElement.showModal();
    };

    const closeUpdateRoleForm = () => {
        const createFromModalElement =
            document.querySelector("#edit-role-form");

        createFromModalElement.close();
    };

    // Function to handle the update of a user's role by making a PUT request to the server

    const handleRoleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare user information for the PUT request
        const userInfo = {
            role: editUserRole,
        };

        try {
            // Request options for the update
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(userInfo),
            };

            // Fetch and update the user's role on the server
            const response = await fetch(
                `http://localhost:5555/users/user/${editUserId}/role/update/`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Update loading status and trigger a refresh of the credential repository data
            fetchCredentialRepo();
        } catch (err) {
            // Handle errors, update loading status, and log them to the console
            setLoading(false);
            console.log(err);
        }
    };

    // change user division
    const openChangeDivisionForm = (user) => {
        setEditUserDivision(user._divisionId._id);
        setEditUserId(user._id);
        const createFromModalElement = document.querySelector(
            "#edit-division-form"
        );

        createFromModalElement.showModal();
    };

    const closeChangeDivisionForm = () => {
        const createFromModalElement = document.querySelector(
            "#edit-division-form"
        );

        createFromModalElement.close();
    };

    // Function to handle the change of a user's division by making a PUT request to the server

    const handleChangeDivision = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare user information for the PUT request
        const userInfo = {
            _divisionId: editUserDivision,
        };

        try {
            // Request options for the update
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(userInfo),
            };

            // Fetch and update the user's division on the server
            const response = await fetch(
                `http://localhost:5555/users/user/${editUserId}/division/update`,
                requestOptions
            );

            // Parse the response data
            const data = await response.json();

            // Update loading status and trigger a refresh of the credential repository data
            fetchCredentialRepo();
        } catch (err) {
            // Handle errors, update loading status, and log them to the console
            setLoading(false);
            console.log(err);
        }
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
            // console.log(data.divisions[0]._organisationalUnitId.name);
            setLoading(false);
        } catch (err) {
            // Handle errors and log them to the console
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="user-info-container">
                        <h1 className="user-info-heading">
                            {credentialRepoInfo.divisionOuName}
                        </h1>
                        <h2 className="user-info-subheading">
                            {credentialRepoInfo.divisionName}
                        </h2>
                        <div className="user-info-operations">
                            <FaRegUserCircle
                                className="user-info-icon"
                                onClick={openUserProfile}
                            />
                            <button
                                className="user-info-btn"
                                onClick={handleLogOut}>
                                LOGOUT
                            </button>
                            <button
                                className="user-info-btn"
                                onClick={openCreateForm}>
                                Add Credential
                            </button>
                        </div>
                    </div>
                    <h3 className="heading-sub">User Credentials</h3>
                    {credentialRepoInfo.credentials.length > 0 ? (
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th className="user-table__header">
                                        Platform
                                    </th>
                                    <th className="user-table__header">
                                        Password
                                    </th>
                                    <th className="user-table__header">
                                        Username
                                    </th>
                                    {credentialRepoInfo.currentUser.role !==
                                        "normal" && (
                                        <th className="user-table__header">
                                            Operations
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {credentialRepoInfo.credentials.map(
                                    (credential, i) => (
                                        <tr key={i}>
                                            <td className="user-table__data">
                                                {credential.platform}
                                            </td>
                                            <td className="user-table__data">
                                                {credential.password}
                                            </td>
                                            <td className="user-table__data">
                                                {credential._userId.username}
                                            </td>

                                            {credentialRepoInfo.currentUser
                                                .role !== "normal" && (
                                                <td className="user-table__data">
                                                    <MdEdit
                                                        className="user-table-operation-icon"
                                                        onClick={() =>
                                                            openEditForm(
                                                                credential
                                                            )
                                                        }
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-credential-message">
                            No Credentials.
                        </div>
                    )}

                    {credentialRepoInfo.currentUser.role === "admin" && (
                        <>
                            <h3 className="heading-sub">Users</h3>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th className="user-table__header">
                                            Username
                                        </th>
                                        <th className="user-table__header">
                                            Division
                                        </th>
                                        <th className="user-table__header">
                                            Role
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, i) => (
                                        <tr
                                            key={i}
                                            className={`${
                                                credentialRepoInfo.currentUser
                                                    ._id === user._id &&
                                                "current-user-row"
                                            }`}>
                                            <td className="user-table__data">
                                                {user.username}
                                            </td>
                                            <td className="user-table__data">
                                                {user._divisionId.name}
                                                {credentialRepoInfo.currentUser
                                                    ._id !== user._id && (
                                                    <MdEdit
                                                        className="user-table-operation-icon user-table-operation-icon-flex"
                                                        onClick={() =>
                                                            openChangeDivisionForm(
                                                                user
                                                            )
                                                        }
                                                    />
                                                )}
                                            </td>
                                            <td className="user-table__data">
                                                {user.role}
                                                {credentialRepoInfo.currentUser
                                                    ._id !== user._id && (
                                                    <MdEdit
                                                        className="user-table-operation-icon user-table-operation-icon-flex"
                                                        onClick={() =>
                                                            openUpdateRoleForm(
                                                                user
                                                            )
                                                        }
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    <dialog id="user-profile-info">
                        <h3>User Profile</h3>
                        <div className="">
                            <div className="">
                                <label className="">Id: </label>
                                <span className="">
                                    {credentialRepoInfo.currentUser._id}
                                </span>
                            </div>
                            <div className="">
                                <label className="">Name: </label>
                                <span className="">
                                    {credentialRepoInfo.currentUser.name}
                                </span>
                            </div>
                            <div className="">
                                <label className="">Surname: </label>
                                <span className="">
                                    {credentialRepoInfo.currentUser.surname}
                                </span>
                            </div>
                            <div className="">
                                <label className="">Role: </label>
                                <span className="">
                                    {credentialRepoInfo.currentUser.role}
                                </span>
                            </div>
                        </div>
                        <button
                            className="form-submit-btn"
                            onClick={closeUserProfile}>
                            Close
                        </button>
                    </dialog>

                    <dialog id="create-user-modal">
                        <h3>Add New Credential</h3>
                        <form
                            className="form-container"
                            onSubmit={handleAddCredential}>
                            <div className="form-controllers">
                                <div className="form-controller">
                                    <label className="form-label">
                                        Platform:{" "}
                                    </label>
                                    <input
                                        placeholder="Enter your name"
                                        type="text"
                                        value={createPlatform}
                                        required
                                        className="form-input"
                                        onChange={(e) => {
                                            setCreatePlatform(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="form-controller">
                                    <label className="form-label">
                                        Password:{" "}
                                    </label>
                                    <input
                                        placeholder="Enter your password"
                                        type="password"
                                        required
                                        className="form-input"
                                        value={createUserPassword}
                                        onChange={(e) => {
                                            setCreateUserPassword(
                                                e.target.value
                                            );
                                        }}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Create"
                                    className="form-submit-btn"
                                />
                            </div>
                        </form>
                        <button
                            className="form-submit-btn"
                            onClick={closeCreateForm}>
                            Close
                        </button>
                    </dialog>

                    <dialog id="edit-credential-modal">
                        <h3>Edit User Credentials</h3>
                        <form
                            onSubmit={handleEditCredential}
                            className="modal-form">
                            <div className="form-controllers">
                                <div className="form-controller">
                                    <label className="form-label">
                                        Platform:{" "}
                                    </label>
                                    <input
                                        placeholder="Enter your name"
                                        type="text"
                                        className="form-input"
                                        value={editPlatform}
                                        onChange={(e) => {
                                            setEditPlatform(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="form-controller">
                                    <label className="form-label">
                                        Password:{" "}
                                    </label>
                                    <input
                                        placeholder="Enter your password"
                                        type="password"
                                        className="form-input"
                                        value={editCredentialPassword}
                                        onChange={(e) => {
                                            setEditCredentialPassword(
                                                e.target.value
                                            );
                                        }}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Update"
                                    className="form-submit-btn"
                                />
                            </div>
                        </form>
                        <button
                            onClick={closeEditForm}
                            className="form-submit-btn">
                            Close
                        </button>
                    </dialog>

                    <dialog id="edit-role-form">
                        <h2>Edit Role</h2>
                        <form
                            onSubmit={handleRoleUpdate}
                            className="modal-form">
                            <div className="form-controllers">
                                <div className="form-controller">
                                    <label className="form-label">Role:</label>
                                    <select
                                        value={editUserRole}
                                        onChange={(e) =>
                                            setEditUserRole(e.target.value)
                                        }
                                        className="form-input"
                                        required>
                                        <option value="admin">admin</option>
                                        <option value="management">
                                            management
                                        </option>
                                        <option value="normal">normal</option>
                                    </select>
                                </div>

                                <input
                                    type="submit"
                                    value="Update"
                                    className="form-submit-btn"
                                />
                            </div>
                        </form>
                        <button
                            onClick={closeUpdateRoleForm}
                            className="form-submit-btn">
                            Close
                        </button>
                    </dialog>

                    <dialog id="edit-division-form">
                        <h2>Edit Division</h2>
                        <form
                            onSubmit={handleChangeDivision}
                            className="modal-form">
                            <div className="form-controllers">
                                <div className="form-controller">
                                    <label className="form-label">
                                        Division:
                                    </label>
                                    <select
                                        value={editUserDivision}
                                        onChange={(e) =>
                                            setEditUserDivision(e.target.value)
                                        }
                                        className="form-input"
                                        required>
                                        {divisions.map((division, i) => (
                                            <option
                                                value={division._id}
                                                key={i}>
                                                {`${division._organisationalUnitId.name} -  ${division.name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="submit"
                                    value="Done"
                                    className="form-submit-btn"
                                />
                            </div>
                        </form>
                        <button
                            onClick={closeChangeDivisionForm}
                            className="form-submit-btn">
                            Close
                        </button>
                    </dialog>
                </>
            )}
        </div>
    );
};

export default Home;
