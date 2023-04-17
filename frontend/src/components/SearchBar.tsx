import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useNavigate } from "react-router";

interface SearchBarProps {
  state: {
    title: string;
    isbn: string;
    author: string;
    description: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setAuthor: React.Dispatch<React.SetStateAction<string>>;
    setIsbn: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
  };
}

const SearchBar: React.FC<SearchBarProps> = ({ state }) => {
  const {
    title,
    setTitle,
    author,
    setAuthor,
    isbn,
    setIsbn,
    description,
    setDescription,
  } = state;

  const { isadmin } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();

  const handleSearch = async () => {
    //append whatever query parameters are not null to get the search params
    const q: string[] = [];
    if (author != "") {
      q.push(`author=${author}`);
    }
    if (title != "") {
      q.push(`title=${title}`);
    }
    if (isbn != "") {
      q.push(`isbn=${isbn}`);
    }
    if (description != "") {
      q.push(`description=${description}`);
    }

    const query = q.join("&");

    //Navigate to the search location
    navigate(`/books?${query}`);
  };

  const onAddBook = () => {
    navigate("/books/add");
  };

  return (
    <div className='p-3 mb-3' style={{ backgroundColor: "#f4f4f4" }}>
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <div className='d-flex'>
          <input
            type='text'
            className='form-control me-2'
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type='text'
            className='form-control me-2'
            placeholder='ISBN'
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
          <input
            type='text'
            className='form-control me-2'
            placeholder='Author'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input
            type='text'
            className='form-control me-2'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className='btn btn-primary me-2' onClick={handleSearch}>
            Search
          </button>
        </div>
        {isadmin ? (
          <div>
            <button className='btn btn-success' onClick={onAddBook}>
              Add Book
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
