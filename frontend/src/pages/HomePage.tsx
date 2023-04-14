import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className='container'>
      <div className='row justify-content-center align-items-center min-vh-100'>
        <div className='col text-center'>
          <h1 className='mb-4'>Little Library</h1>
          <Link to='/books'>
            <img
              src='android-chrome-192x192.png' //'android-chrome-512x512.png'
              alt='android-chrome-512x512.png'
              className='img-fluid'
            />
          </Link>
          <h2 className='mb-4'>Welcome!</h2>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
