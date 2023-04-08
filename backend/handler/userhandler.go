package handler

import (
	"encoding/json"
	"fmt"
	"myapp/controller"
	"myapp/models"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

type JWTResponse struct {
	Token string `json:"token"`
}

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

	exists, err := models.UserExistsByEmail(user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Check if user exists")
		return
	}
	if exists {
		http.Error(w, "User already exists", http.StatusBadRequest)
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
	err = models.CreateUser(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	db_user, err := models.GetUserByEmail(user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//create Token and add it to JWTResponse Object
	tokenString, err := controller.CreateUserToken(db_user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response := JWTResponse{Token: tokenString}

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

	///Get the User corresponding into the sign in
	db_user, err := models.GetUserByEmail(user.Email)
	if err != nil {
		fmt.Println("failed to find user")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate the user's password using bcrypt.
	err = bcrypt.CompareHashAndPassword([]byte(db_user.Password), []byte(user.Password))
	if err != nil {
		fmt.Println("Failed to hash Password")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	//create Token and add it to JWTResponse Object
	tokenString, err := controller.CreateUserToken(db_user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response := JWTResponse{Token: tokenString}

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
	user, ok := controller.GetUserFromJWT(w, r)
	if !ok {
		http.Error(w, "Failed to authenticate user", http.StatusForbidden)
		return
	}

	user.Password = ""

	jsonResponse, err := json.Marshal(user)
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
	user, ok := controller.GetUserFromJWT(w, r)
	if !ok {
		http.Error(w, "Failed to authenticate user", http.StatusForbidden)
		return
	}
	//Check if signed in user is Admin, if not throw an error
	if !user.IsAdmin {
		http.Error(w, "Failed, user is not admin", http.StatusForbidden)
		return
	}

	//Get the user from the request body corresponding to the user to grant admin access to
	var request_user models.User
	err := json.NewDecoder(r.Body).Decode(&request_user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Failed to Load JSON")
		return
	}

	err = models.GrantAdminAccess(request_user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}
