import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuth } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { RootState, AppDispatch } from "../app/store";
import { useSearchParams } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { success, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast(error);
      dispatch(resetAuth());
    }
    if (success) {
      navigate("/");
    }
  }, [success, loading, error, dispatch]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch(login({ email, password }));
  };

  //Handle toast in redirect
  const [searchParams] = useSearchParams();

  const redirectQuery = searchParams.get("redirect");
  useEffect(() => {
    if (redirectQuery == "badtoken") {
      toast("Please login or register to continue");
      navigate("/login");
    }
  }, [redirectQuery]);

  return (
    <>
      <div className='container-fluid bg-light-blue'>
        <div className='row justify-content-center mt-5'>
          <div className='col-md-6'>
            <div className='card bg-light p-4'>
              <div className='card-body'>
                <h2 className='text-center mb-4'>Login</h2>
                <form onSubmit={handleSubmit}>
                  <div className='form-group mb-2'>
                    <label htmlFor='email'>Email address</label>
                    <input
                      type='email'
                      className='form-control'
                      id='email'
                      placeholder='Enter email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div className='form-group mb-2'>
                    <label htmlFor='password'>Password</label>
                    <input
                      type='password'
                      className='form-control'
                      id='password'
                      placeholder='Password'
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  <button
                    type='submit'
                    className='btn btn-primary btn-block mt-4'
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
