import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import BooksPage from "./pages/BooksPage";
import BookPage from "./pages/BookPage";
import { ToastContainer } from "react-toastify";
import { AppDispatch } from "./app/store";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "./app/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import AddBookPage from "./pages/AddBookPage";
import AdminPage from "./pages/AdminPage";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/books' element={<BooksPage />} />
          <Route path='/books/:isbn' element={<BookPage />} />
          <Route path='/books/add' element={<AddBookPage />} />
          <Route path='/admin' element={<AdminPage />} />

          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
