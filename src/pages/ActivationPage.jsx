import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import { server } from '../server';

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res);
        } catch (err) {
          setError(true);
        }
      };
      sendRequest();
    }
  }, [activation_token]); // Add dependency array to run effect only once

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-yellow-600 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        {error ? (
          <div className="text-red-600">
            <h2 className="text-2xl font-semibold">Oops!</h2>
            <p className="mt-4 text-lg">Your token has expired or is invalid. Please try again.</p>
          </div>
        ) : (
          <div className="text-green-600">
            <h2 className="text-2xl font-semibold">Success!</h2>
            <p className="mt-4 text-lg">Your account has been successfully activated. You can now log in.</p>
          </div>
        )}
        <div className="mt-6">
          <a href="/login" className="text-blue-600 hover:underline text-lg">
            Go to Login Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
