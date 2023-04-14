import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RootState, AppDispatch } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import api from "../app/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function Header() {
  const { token, success, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  const [Admin, setAdmin] = useState(false);

  useEffect(() => {
    const getIsAdmin = async () => {
      const response = await api.get("/users/me");
      const { isadmin } = response.data;
      setAdmin(isadmin);
    };
    getIsAdmin().catch((error) => setAdmin(false));
  }, [success, token, loading, dispatch]);

  return (
    <nav
      className='navbar navbar-expand-md navbar-dark bg-primary '
      style={{ padding: "15px" }}
    >
      <Link className='navbar-brand' to='/'>
        Little Library
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
              {Admin ? (
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
