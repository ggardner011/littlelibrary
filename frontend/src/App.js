import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import PostsPage from './pages/PostsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/posts' element={<PostsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
