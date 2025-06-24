import React, { useState } from 'react';
import SacoLogo from '../../../assets/saco.png';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../../../services/api'; // <-- import the userLogin function

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const result = await userLogin(username, password);
      console.log(result);
      setLoading(false);

      if (result.success && result.data.status === "Success") {
        const { user, employee, apps } = result.data;

        // ✅ Store in localStorage
        localStorage.setItem('handHeldUser', JSON.stringify(user));
        localStorage.setItem('handHeldEmployee', JSON.stringify(employee));
        localStorage.setItem('handHeldapps', JSON.stringify(apps));
        

        navigate('/mobile-serial-app/entryScreen');
      } else {
        const apiError = result.data?.error?.message || result.error || 'Login failed. Please try again.';
        setErrorMsg(apiError);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#103B63] text-white px-4 overflow-hidden">
      <div className="mb-5">
        <img src={SacoLogo} alt="SACO Logo" className="w-30 h-30 object-contain" />
      </div>

      <div className="flex items-start flex-col w-full max-w-sm">
        <h2 className="text-xl font-medium mb-1 text-center">Login</h2>

        <div className="mb-4 w-full">
          <label className="block mb-1 text-sm">
            Enter Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-transparent border border-white rounded outline-none placeholder-white"
            required
          />
        </div>

        <div className="mb-1 w-full">
          <label className="block mb-1 text-sm">
            Enter Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-transparent border border-white rounded outline-none placeholder-white"
            required
          />
        </div>

        {errorMsg && (
          <div className="mb-4 text-red-500 text-center text-sm">*{errorMsg}*</div>
        )}

        <div className='flex flex-col justify-center align-middle w-full'>
          <button
            onClick={handleLogin}
            className="mt-3 self-center w-1/2 sm:w-1/2 border border-white text-white py-2 rounded hover:bg-white hover:text-[#103B63] transition text-center"
            disabled={loading || !username || !password}
          >
            {loading ? 'Logging...' : 'Login'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
