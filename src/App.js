import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:5000/login', { username, password });
            localStorage.setItem('token', res.data.token);
            setMessage(res.data.message);
            window.location.href = '/dashboard';
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-400 to-purple-600">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <input
                  className="border p-2 w-full mb-3 rounded"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <div className="relative">
                  <input
                      className="border p-2 w-full rounded pr-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
              </div>
              <button
                  className="bg-blue-500 text-white p-2 w-full mt-4 rounded hover:bg-blue-600"
                  onClick={handleLogin}
              >
                  Login
              </button>
              {message && <p className="text-red-500 mt-3">{message}</p>}
          </div>
      </div>
  );
}
