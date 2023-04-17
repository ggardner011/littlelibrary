import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuth } from "../features/auth/authSlice";
import api from "../app/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function Header() {
  const { isadmin } = useSelector((state: RootState) => state.user);
  const { success } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav
      className='navbar navbar-expand-md navbar-dark bg-primary '
      style={{ padding: "15px" }}
    >
      <Link className='navbar-brand navbar bg-body-tertiary' to='/'>
        <div className='container-fluid'>
          <img
            src='android-chrome-192x192.png' //'android-chrome-512x512.png'
            alt='android-chrome-512x512.png'
            width='30'
            height='24'
            className='d-inline-block align-text-top text-white '
          />

          <div className='text-white ms-2'>Little Library</div>
        </div>
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#navbarNav'
        aria-controls='navbarNav'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav mr-auto'>
          <li className='nav-item'>
            <Link className='nav-link' to='/books'>
              Books
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/about'>
              About
            </Link>
          </li>
        </ul>
        <ul className='navbar-nav ms-auto'>
          {!success ? (
            <>
              <li className='nav-item'>
                <Link className='nav-link' to='/login'>
                  Login
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link' to='/register'>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {isadmin ? (
                <li className='nav-item'>
                  <Link className='nav-link' to='/admin'>
                    Admin
                  </Link>
                </li>
              ) : (
                <></>
              )}
              <li
                className='nav-item'
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                <div className='nav-link'>Logout</div>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
