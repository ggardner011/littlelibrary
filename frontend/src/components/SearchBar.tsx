import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface SearchBarProps {
  onSearch: (searchParams: {
    title: string;
    isbn: string;
    author: string;
  }) => void;
  onAddBook: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onAddBook }) => {
  const { isadmin } = useSelector((state: RootState) => state.user);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");

  const handleSearch = () => {
    onSearch({ title, isbn, author });
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
