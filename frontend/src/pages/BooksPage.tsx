import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { getAxiosError } from "../app/helpers";
import { toast } from "react-toastify";
import api from "../app/api";
import BookList from "../components/BookList";
import { Book } from "../app/interfaces";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

const BooksPage: React.FC = () => {
  const navigate = useNavigate();

  //Get values of URL search params
  const [searchParams] = useSearchParams();

  const authorQuery: string | null = searchParams.get("author");
  const titleQuery: string | null = searchParams.get("title");
  const isbnQuery: string | null = searchParams.get("isbn");
  const descriptionQuery: string | null = searchParams.get("description");

  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getBooks = async () => {
      //append whatever query parameters are not null to get the search params
      const q: string[] = [];
      let querySetter = (query: string | null, set: any, category: string) => {
        if (query != null) {
          set(query);
          q.push(`${category}=${query}`);
        } else {
          set("");
        }
      };
      //Set queries for categories
      querySetter(authorQuery, setAuthor, "author");
      querySetter(titleQuery, setTitle, "title");
      querySetter(isbnQuery, setIsbn, "isbn");
      querySetter(descriptionQuery, setDescription, "description");

      //Only make api reuqest if parameters have been added
      if (q.length > 0) {
        //Limit to 20 books
        q.push("limit=20");
        const query = q.join("&");
        try {
          const response = await api.get(`/books/search?${query}`);
          setBooks(response.data);
        } catch (error) {
          const message = getAxiosError(error);
          toast(message);
        }
      } else {
        setBooks([]);
      }
    };
    getBooks();
  }, [authorQuery, titleQuery, isbnQuery, descriptionQuery]);

  return (
    <>
      <div>
        <SearchBar
          state={{
            title,
            setTitle,
            author,
            setAuthor,
            isbn,
            setIsbn,
            description,
            setDescription,
          }}
        />
      </div>

      <BookList books={books}></BookList>
    </>
  );
};

export default BooksPage;
