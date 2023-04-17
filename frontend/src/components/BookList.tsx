import React from "react";
import { Book } from "../app/interfaces";
import { Link } from "react-router-dom";
import { getDisplayDate } from "../app/helpers";

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className='row row-cols-1 row-cols-md-2 g-2 p-2'>
      {books.map((book) => (
        <div key={book.id} className='col'>
          <Link
            to={`/books/${book.isbn}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className='card h-100'>
              <div className='card-body p-3'>
                <h6
                  className='card-subtitle mb-2 text-muted'
                  style={{ fontSize: "1.2rem" }}
                >
                  {book.title}
                </h6>
                <p className='card-text mb-1'>Author: {book.author}</p>
                <p className='card-text mb-1'>ISBN: {book.isbn}</p>
                <p className='card-text mb-0'>
                  Publishing Date: {getDisplayDate(book.publishing_date)}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookList;
