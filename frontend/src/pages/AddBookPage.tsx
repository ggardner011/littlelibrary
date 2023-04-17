import { useEffect, useState } from "react";
import { Book } from "../app/interfaces";
import { toast } from "react-toastify";
import api from "../app/api";
import { getAxiosError, getDisplayDate } from "../app/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const AddBookPage: React.FC = () => {
  const { isadmin } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [publishingDate, setPublishingDate] = useState("");

  const handleSaveClick = async () => {
    const data: Book = {
      isbn: isbn,
      author: author,
      description: description,
      title: title,
      publishing_date: publishingDate,
    };

    try {
      const response = await api.post(`/books`, data);
      navigate(`/books/${response.data.isbn}`);
    } catch (error) {
      const message = getAxiosError(error);
      toast(message);
    }
  };

  const handleResetClick = () => {
    setIsbn("");
    setTitle("");
    setAuthor("");
    setDescription("");
    setPublishingDate("");
  };

  const handleChangeISBN = (event: any) => {
    const { value } = event.target;
    const regex = /^[0-9]{0,13}$/;
    if (regex.test(value)) {
      setIsbn(value);
    }
  };

  return (
    <div className='container-fluid bg-light-blue'>
      <div className='row justify-content-center mt-5'>
        <div className='col-md-6'>
          <div className='card bg-light p-4'>
            <div className='card-body'>
              {
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
                    <label htmlFor='isbnInput' className='form-label'>
                      ISBN
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='titleInput'
                      value={isbn}
                      onChange={handleChangeISBN}
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
                    onClick={handleResetClick}
                  >
                    Reset
                  </button>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;
