import { useState } from "react";

const AdminPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  return (
    <div className='container-fluid bg-light-blue'>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-4'>
          <div className='card bg-light p-4'>
            <h1 className='text-center mb-4'>Grant Admin Access</h1>
            <div className='card-body'>
              <div className='d-flex align-items-end justify-content-between'>
                <div className='form-group mb-3 me-3'>
                  <label
                    htmlFor='emailInput'
                    className='form-label custom-form-label'
                  >
                    Email
                  </label>
                  <input
                    id='emailInput'
                    type='text'
                    className='form-control'
                    placeholder='example@example.com'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className='form-group mb-3 me-3'>
                  <label
                    htmlFor='nameInput'
                    className='form-label custom-form-label'
                  >
                    Name
                  </label>
                  <input
                    id='nameInput'
                    type='text'
                    className='form-control'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <button className='btn btn-primary mb-3' onClick={() => {}}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
