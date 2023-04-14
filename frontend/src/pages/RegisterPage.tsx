import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { RootState, AppDispatch } from "../app/store";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { success, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast(error);
      dispatch(reset());
    }
    if (success) {
      navigate("/");
    }
  }, [success, loading, error, dispatch]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password === password2) {
      dispatch(register({ name, email, password }));
    } else {
      toast.error("Passwords do not match");
    }
  };

  return (
    <>
      <div className='container-fluid bg-light-blue'>
        <div className='row justify-content-center mt-5'>
          <div className='col-md-6'>
            <div className='card bg-light p-4'>
              <div className='card-body'>
                <h2 className='text-center mb-4'>Register</h2>
                <form onSubmit={handleSubmit}>
                  <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      className='form-control'
                      id='name'
                      placeholder='Enter name'
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>
                  <div className='form-group'>
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
                  <div className='form-group'>
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
                  <div className='form-group'>
                    <label htmlFor='password2'>Confirm Password</label>
                    <input
                      type='password'
                      className='form-control'
                      id='password2'
                      placeholder='Password'
                      value={password2}
                      onChange={(event) => setPassword2(event.target.value)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='btn btn-primary btn-block mt-4'
                  >
                    Register
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

export default RegisterPage;
