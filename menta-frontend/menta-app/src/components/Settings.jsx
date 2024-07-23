import React, { useState } from 'react';
import NavBar from './NavBar';

const Settings = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = () => {
    // send to backend from here
    setMessage('Changes saved successfully!');
  };

  return (
	<div className="relative min-h-screen">
		<NavBar />
		<div className="max-w-md mx-auto p-8 border rounded-lg shadow-md mt-20">
		<h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
			<input
			type="text"
			className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			value={name}
			onChange={(e) => setName(e.target.value)}
			/>
		</div>
		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
			<input
			type="text"
			className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			value={username}
			onChange={(e) => setUsername(e.target.value)}
			/>
		</div>
		<div className="mb-4">
			<label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
			<input
			type="password"
			className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			value={password}
			onChange={(e) => setPassword(e.target.value)}
			/>
		</div>
		<button
			className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
			onClick={handleSave}
		>
			Save Changes
		</button>
		{message && <p className="mt-4 text-green-500 text-center">{message}</p>}
		</div>
	</div>
  );
};

export default Settings;