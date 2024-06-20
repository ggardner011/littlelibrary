import { useEffect, useState } from "react";
import { Book } from "../app/interfaces";
import { toast } from "react-toastify";
import api from "../app/api";
import { getAxiosError, getDisplayDate } from "../app/helpers";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const BookPage: React.FC = () => {
  const { isadmin } = useSelector((state: RootState) => state.auth);
  const { isbn } = useParams<{ isbn: string }>();

  const [book, setBook] = useState<Book>({
    id: undefined,
    title: "",
    author: "",
    isbn: "",
    description: "",
    publishing_date: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description);
  const [publishingDate, setPublishingDate] = useState(
    book.publishing_date.substring(0, 10)
  );

  //Get book by isbn
  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await api.get(`/books?isbn=${isbn}`);

        setBook(response.data);
      } catch (error) {
        const message = getAxiosError(error);
        toast(message);
      }
    };
    getBook();
  }, [isbn]);

  const handleEditClick = () => {
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setPublishingDate(book.publishing_date.substring(0, 10));
    setIsEditing(!isEditing);
  };

  const handleCancelClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async () => {
    const data: Book = {
      isbn: book.isbn,
      author: author,
      description: description,
      title: title,
      publishing_date: publishingDate,
    };
    try {
      const response = await api.put(`/books`, data);

      setBook(response.data);
      setTitle(book.title);
      setAuthor(book.author);
      setDescription(book.description);
      setPublishingDate(book.publishing_date.substring(0, 10));
      setIsEditing(!isEditing);
    } catch (error) {
      const message = getAxiosError(error);
      toast(message);
    }
  };

  return (
    <div className='container-fluid bg-light-blue'>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-6'>
          <div className='card bg-light p-4'>
            <div className='card-body'>
              <h1 className='text-center mb-4'>{book.title}</h1>

              <p>ISBN: {book.isbn}</p>

              {isEditing ? (
                <form>
                  <div className='mb-3'>
                    <label htmlFor='titleInput' className='form-label'>
                      Title
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='titleInput'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='authorInput' className='form-label'>
                      Author
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='authorInput'
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='descriptionInput' className='form-label'>
                      Description
                    </label>
                    <textarea
                      className='form-control'
                      id='descriptionInput'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='publishingDateInput' className='form-label'>
                      Publishing Date
                    </label>
                    <input
                      type='date'
                      className='form-control'
                      id='publishingDateInput'
                      value={publishingDate}
                      onChange={(e) => setPublishingDate(e.target.value)}
                    />
                  </div>

                  <button
                    type='button'
                    className='btn btn-success me-3 '
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary me-3'
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p>Author: {book.author}</p>
                  <p>Description: {book.description}</p>
                  <p>Publishing Date: {getDisplayDate(book.publishing_date)}</p>
                  {isadmin ? (
                    <button
                      type='button'
                      className='btn btn-primary me-3'
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
