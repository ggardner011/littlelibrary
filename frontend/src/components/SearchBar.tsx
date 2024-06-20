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

  const { isadmin } = useSelector((state: RootState) => state.auth);

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
      <div className='d-flex align-items-center justify-content-between '>
        <div className='d-flex'>
          <div className='form-group mb-3 me-3'>
            <label
              htmlFor='titleInput'
              className='form-label custom-form-label '
            >
              Title
            </label>
            <input
              id='titleInput'
              type='text'
              className='form-control'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className='form-group mb-3 me-3'>
            <label htmlFor='isbnInput' className='form-label custom-form-label'>
              ISBN
            </label>
            <input
              id='isbnInput'
              type='text'
              className='form-control'
              placeholder='ISBN'
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>

          <div className='form-group mb-3 me-3'>
            <label
              htmlFor='authorInput'
              className='form-label custom-form-label'
            >
              Author
            </label>
            <input
              id='authorInput'
              type='text'
              className='form-control'
              placeholder='Author'
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className='form-group mb-3 me-3'>
            <label
              htmlFor='descriptionInput'
              className='form-label custom-form-label'
            >
              Description
            </label>
            <input
              id='descriptionInput'
              type='text'
              className='form-control'
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            className='btn btn-primary mt-auto mb-3'
            onClick={handleSearch}
          >
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
