import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login.jsx";

function AuthPage() {

    const [isLogin, setIsLogin] = useState(false); // login state variable

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const validatePassword = (pwd) => {
        if (pwd.length < 8) {
            return "Password must be at least 8 characters long";
        }
        return ""; // empty string = no error
    };

    const addUser = () => {
        setErrorMessage("");

        if (!username || !password) {
            setErrorMessage("Username and password are required");
            return;
        }

        const validationError = validatePassword(password);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        localStorage.setItem('userUsername', username);
        localStorage.setItem('userPassword', password);

        navigate('/login');
    };

    const clearList = () => {
        setUsername('');
        setPassword('');
        if (!isLogin) {
            localStorage.removeItem("userUsername");
            localStorage.removeItem("userPassword");
        }
    };

    if (isLogin) {
        return (
            <div>
                <Login setIsLogin={setIsLogin} /> {/* pass setIsLogin as a prop */}
                <div className="switch-reg-box">
                    <p className="switch-reg-p">
                        Don't have an account?{" "}
                        <button type="button" onClick={() => setIsLogin(false)} className="switch-reg-btn">
                            Register
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <h1 className="title">Register an account</h1>
            <br />

            <div className="reg-form">

                <div className="inputs">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="margin-b" />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" />
                </div>

                <div className="buttons">
                    <button onClick={addUser} className="margin-b">Register</button>
                    <button onClick={clearList}>Clear</button>
                </div>

                {errorMessage && (
                    <p style={{
                        color: errorMessage.includes("successful") ? "green" : "red",
                        marginTop: "10px"
                    }}>
                        {errorMessage}
                    </p>
                )}

            </div>

            <div>
                <p className="switch-login-p">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setIsLogin(true)} className="switch-login-btn">
                        Log in
                    </button>
                </p>
            </div>

        </div>
    );
}

export default AuthPage;