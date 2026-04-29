import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit() {
        const formInfo = new FormData();
        formInfo.append('username', username);
        formInfo.append('password', password);

        fetch(import.meta.env.VITE_API_URL + '/login', {
            method: "POST",
            credentials: 'include',
            body: formInfo
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            navigate('/Home');
        })
        .catch((error) => console.log(error));
    }

    return (
        <div className="login-container">
            <div className="login">
                <h2>Iniciar sesión</h2>
                <input type='text' placeholder="Usuario" value={username} onChange={handleUsernameChange} />
                <input type='password' placeholder="Contraseña" value={password} onChange={handlePasswordChange} />
                <input type='submit' onClick={handleSubmit} value="Iniciar sesión" className="submit-button"/>
            </div>
        </div>
    );
}