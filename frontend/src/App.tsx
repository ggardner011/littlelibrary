import React, { useState } from "react";
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
import { getUser, resetUser } from "./features/user/userSlice";
import { toast } from "react-toastify";

const App: React.FC = () => {
  const { success, loading } = useSelector((state: RootState) => state.auth);
  const { error } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();
  //Get user from api if token retrieval is success
  useEffect(() => {
    if (success) {
      dispatch(getUser());
    } else {
      dispatch(resetUser());
    }

    if (error) {
      toast(error);
      dispatch(resetUser());
    }
  }, [success, loading, dispatch]);

  ///Persist state on Route changes
  const [books, setBooks] = useState([]);
  ///

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route
            path='/books'
            element={<BooksPage books={books} setBooks={setBooks} />}
          />
          <Route path='/books/:isbn' element={<BookPage />} />

          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
