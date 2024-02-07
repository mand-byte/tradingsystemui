import React, { useState } from 'react';

import { login } from 'api';
import {useNavigate} from 'react-router-dom';



const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            var user=await login({data:{username:username,password:password}})
            if(user){
                navigate('/dashboard')
            }
            
        } catch (error) {
            // 登录失败，处理错误
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;