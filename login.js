import React, { useState } from 'react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { username, password });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat relative" 
         style={{ backgroundImage: "url('background-image.jpg')" }}>
      {/* Blur effect for background */}
      <div className="absolute inset-0 bg-inherit filter blur-md z-0"></div>
      
      <div className="w-full max-w-md p-10 bg-gray-800 bg-opacity-80 rounded-xl shadow-xl border-l-4 border-red-700 text-center relative z-10">
        <div className="mb-5">
          <img src="whitworth-logo.png" alt="Whitworth University Logo" className="w-24 mx-auto mb-5" />
        </div>
        
        <h1 className="text-2xl font-semibold text-white mb-1">Admin Dashboard</h1>
        <div className="text-teal-400 text-sm font-medium mb-6">Secure Administrator Access</div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5 text-left">
            <label htmlFor="username" className="block mb-1.5 text-sm text-yellow-200">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border-2 border-gray-700 bg-white bg-opacity-5 rounded-md text-white text-base focus:outline-none focus:border-teal-600"
            />
          </div>
          
          <div className="mb-5 text-left">
            <label htmlFor="password" className="block mb-1.5 text-sm text-yellow-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-gray-700 bg-white bg-opacity-5 rounded-md text-white text-base focus:outline-none focus:border-teal-600"
            />
            <div className="text-right mt-1">
              <a href="#" className="text-xs text-teal-400 hover:text-teal-300">
                Forgot Password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full p-3 bg-red-700 text-white border-none rounded-md text-base font-semibold cursor-pointer transition-all hover:bg-teal-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;