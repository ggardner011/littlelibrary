import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { getAxiosError } from "../app/helpers";
import { toast } from "react-toastify";
import api from "../app/api";
import BookList from "../components/BookList";
import { Book } from "../app/interfaces";
import { useNavigate } from "react-router";

interface BooksPageProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<never[]>>;
}

const BooksPage: React.FC<BooksPageProps> = ({ books, setBooks }) => {
  const navigate = useNavigate();

  const handleSearch = async (searchParams: {
    title: string;
    isbn: string;
    author: string;
  }) => {
    const { title, isbn, author } = searchParams;
    try {
      const response = await api.get(
        `/books/search?author=${author}&title=${title}&isbn=${isbn}&limit=20`
      );
      setBooks(response.data);
    } catch (error) {
      const message = getAxiosError(error);
      toast(message);
    }
  };

  const handleAddBook = () => {
    navigate("/books/add");
  };

  return (
    <>
      <div>
        <SearchBar onSearch={handleSearch} onAddBook={handleAddBook} />
      </div>

      <BookList books={books}></BookList>
    </>
  );
};

export default BooksPage;
