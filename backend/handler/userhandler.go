package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"myapp/controller"
	"myapp/models"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// HTTP handler to create a new user.
func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the JSON request body into a User object.
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Load JSON")
		return
	}

	db_user, err := models.GetUserByEmail(user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Check if user exists")
		return
	}
	if db_user != nil {
		err = errors.New("user Already Exists")
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("User already exists")
		return

	}

	// Hash the user's password using bcrypt.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Failed to hash Password")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPassword)

	// Call the CreateUser function to insert the new user into the database.
	_, err = models.CreateUser(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	//create Token and add it to JWTResponse Object
	tokenString, err := controller.CreateUserToken(&user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response := Response{Token: tokenString}

	// Marshal the struct to JSON
	jsonResponse, err := json.Marshal(response)
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

// HTTP handler to create a new user.
func LoginUserHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the JSON request body into a User object.
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Load JSON")
		return
	}

	//Check if user exists, probably not optimal

	///Get the User corresponding into the sign in
	db_user, err := models.GetUserByEmail(user.Email)
	if err != nil {
		fmt.Println("failed to find user")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	//If user does not exist return error
	if db_user == nil {
		http.Error(w, "User does not exist", http.StatusBadRequest)
		return
	}

	// Validate the user's password using bcrypt.
	err = bcrypt.CompareHashAndPassword([]byte(db_user.Password), []byte(user.Password))
	if err != nil {
		fmt.Println("Failed to hash Password")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//create Token and add it to JWTResponse Object
	tokenString, err := controller.CreateUserToken(db_user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response := Response{Token: tokenString}

	// Marshal the struct to JSON
	jsonResponse, err := json.Marshal(response)
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

// HTTP handler to get a user.

// Secured with JWT
func GetSelfHandler(w http.ResponseWriter, r *http.Request) {
	user, ok := controller.GetUserClaims(w, r)
	if !ok {
		http.Error(w, "Failed to authenticate user", http.StatusForbidden)
		return
	}

	//Get user data
	user_db, err := models.GetUserByID(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed to get user")
		return
	}

	user_db.Password = ""

	jsonResponse, err := json.Marshal(user_db)
	if err != nil {
		http.Error(w, "Failed to create JSON", http.StatusInternalServerError)
		return
	}

	// Set the response headers
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Write the JSON response to the response body
	w.Write(jsonResponse)
}

// Checks that the user is an Admin and if so, grants the user specified in the request body admin access
func AddAdminHandler(w http.ResponseWriter, r *http.Request) {
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

	//Get the user from the request body corresponding to the user to grant admin access to
	var request_user models.User
	err = json.NewDecoder(r.Body).Decode(&request_user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Load JSON")
		return
	}

	err = models.GrantAdminAccess(request_user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := Response{Message: fmt.Sprintf("Admin access granted to %s", request_user.Email)}

	// Marshal the struct to JSON
	jsonResponse, err := json.Marshal(response)
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
