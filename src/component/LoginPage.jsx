'use client';

import { useState } from 'react';
import { config } from '../conf/config';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        // Handle login logic here (e.g., API call)
        console.log('Logging in with:', formData,config);
        try {
            const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //credentials: 'include', // IMPORTANT
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.email, // Assuming username is the same as email
                    password: formData.password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                // Set token in cookies or local storage
                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                // console.log(data.user)

                // Redirect or update state as needed
                router.push('/admin'); 
                setIsLoading(false);
            } else {
                console.error('Login failed:', response.statusText);
                setError('Login failed. Please check your credentials.');
                setIsLoading(false);
                // Handle error (e.g., show error message)
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred. Please try again later.');
            setIsLoading(false);
            
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
                {/* <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Events</h2> */}
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Login to your account</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email or Username</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 text-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 text-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                    </div>
                    {
                        error && (
                            <div className="text-red-500 text-sm mt-2">
                                {error}
                            </div>
                        )
                    }

                    {
                        isLoading ?
                            (<button
                                type="disabled"
                                className="w-full bg-blue-600 cursor-progress hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                            >
                                Please wait...
                            </button>) :
                            (

                                <button
                                    type="submit"
                                    className="w-full  bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                                >
                                    Sign In
                                </button>
                            )
                    }
                </form>

                {/* <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{' '}
          <a href="#" className="text-blue-600 hover:underline font-medium">Sign up</a>
        </p> */}
            </div>
        </div>
    );
};

export default LoginPage;
