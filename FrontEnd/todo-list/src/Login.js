import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`https://todo-list-v547.onrender.com:5000/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha: password }),
    });

    const data = await response.json();

        if (response.ok) {
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('userId', data.userId);
            navigate('/app'); 
        }
        else {
            setError(data.error);
        }
        } catch (error) {
        console.error('Erro ao fazer login:', error);
        setError('Erro ao fazer login. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="login">
        <h1>Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete='email'
                    required
                />
            </div>
            <div>
                <label>Senha:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete='current-password'
                    required
                />
            </div>
            <button type="submit">Entrar</button>
        </form>
        <p>
            Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
        </p>
        </div>
    );
};

export default Login;
