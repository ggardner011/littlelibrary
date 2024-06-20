package handler

import (
	"encoding/json"
	"fmt"
	"myapp/controller"
	"myapp/models"
	"net/http"
	"strconv"
)

// ////////////////////////
// HTTP handler to create a new user.
func CreateBookHandler(w http.ResponseWriter, r *http.Request) {

	//Get User Auth claims
	user, ok := controller.GetUserClaims(w, r)
	if !ok {
		http.Error(w, "Failed to authenticate user", http.StatusForbidden)
		return
	}
	//Get user from db and check if they are an admin. This is done in case access has been revoked since the JWT was issued.
	db_user, err := models.GetUserByID(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed to get user")
		return
	}
	//Check if signed in user is Admin, if not throw an error
	if !db_user.IsAdmin {
		http.Error(w, "Failed, user is not admin", http.StatusForbidden)
		return
	}

	// Parse the JSON request body into a User object.
	book := &models.Book{}
	err = json.NewDecoder(r.Body).Decode(book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Load JSON")
		return
	}

	//add the user ID to the book and save to database
	book.AddedBy = db_user.ID

	book, err = models.CreateBook(book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Set the response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Marshal the struct to JSON
	jsonResponse, err := json.Marshal(book)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// Set the response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Write the JSON response to the response body
	w.Write(jsonResponse)
}

// ////////////////////////
// HTTP handler to create a new user.
func UpsertBookHandler(w http.ResponseWriter, r *http.Request) {

	//Get User Auth claims
	user, ok := controller.GetUserClaims(w, r)
	if !ok {
		http.Error(w, "Failed to authenticate user", http.StatusForbidden)
		return
	}
	//Get user from db and check if they are an admin. This is done in case access has been revoked since the JWT was issued.
	db_user, err := models.GetUserByID(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed to get user")
		return
	}
	//Check if signed in user is Admin, if not throw an error
	if !db_user.IsAdmin {
		http.Error(w, "Failed, user is not admin", http.StatusForbidden)
		return
	}

	// Parse the JSON request body into a User object.
	book := &models.Book{}
	err = json.NewDecoder(r.Body).Decode(book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Load JSON")
		return
	}

	//add the user ID to the book and save to database
	book.AddedBy = db_user.ID

	book, err = models.UpsertBook(book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Set the response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Marshal the struct to JSON
	jsonResponse, err := json.Marshal(book)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// Set the response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Write the JSON response to the response body
	w.Write(jsonResponse)
}

// ////////////////////////////////////
// HTTP handler to create a new user.
func GetBookHandler(w http.ResponseWriter, r *http.Request) {

	//Get User Auth claims
	user, ok := controller.GetUserClaims(w, r)
	if !ok {
		http.Error(w, "Failed to authenticate user", http.StatusForbidden)
		return
	}
	//Get user from db
	_, err := models.GetUserByID(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed to get user")
		return
	}

	//Create book
	book := &models.Book{}
	// Retrieve query parameters from the URL
	queryParams := r.URL.Query()

	//

	// Retrieve values of parameters and parse them into the Book Struct
	book.ISBN = queryParams.Get("isbn")

	id := queryParams.Get("id")
	if id != "" {
		val, err := strconv.ParseUint(id, 10, 32)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		book.ID = uint(val)
	}
	//Get Book according to params
	book, err = models.GetBook(book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Marshal the struct to JSON
	jsonResponse, err := json.Marshal(book)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// Set the response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Write the JSON response to the response body
	w.Write(jsonResponse)
}

// /////////////////////////////////
// HTTP handler to create a new user.
func SearchBooksHandler(w http.ResponseWriter, r *http.Request) {

	//Get User Auth claims
	user, ok := controller.GetUserClaims(w, r)
	if !ok {
		http.Error(w, "Failed to authenticate user", http.StatusForbidden)
		return
	}
	//Get user from db
	_, err := models.GetUserByID(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed to get user")
		return
	}

	//Create book
	book := &models.Book{}
	// Retrieve query parameters from the URL
	queryParams := r.URL.Query()

	// Retrieve the value of the parameters
	book.ISBN = queryParams.Get("isbn")
	book.Author = queryParams.Get("author")
	book.Title = queryParams.Get("title")
	book.Description = queryParams.Get("description")

	//Parse out the number of records requested
	limit := queryParams.Get("limit")
	var c int
	if limit != "" {
		val, err := strconv.ParseUint(limit, 10, 32)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		c = int(val)
	} else {
		c = 10
	}

	//Get Book according to params
	books, err := models.GetBooks(book, c)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Marshal the struct to JSON
	jsonResponse, err := json.Marshal(books)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	// Set the response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Write the JSON response to the response body
	w.Write(jsonResponse)
}
