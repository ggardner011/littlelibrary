package models

import (
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/lib/pq"
)

type User struct {
	ID       string
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

func CreateUser(user User) error {
	// Get the database connection.
	db := getDB()

	// Prepare the SQL statement.
	stmt, err := db.Prepare("INSERT INTO users (name, email, password) VALUES ($1, $2, $3);")
	if err != nil {
		fmt.Println("Failed to create SQL statement")
		return err
	}
	defer stmt.Close()

	// Execute the SQL statement with the user data.
	_, err = stmt.Exec(user.Name, user.Email, user.Password)
	if err != nil {
		fmt.Println("Failed to execute SQL statement")
		return err
	}

	fmt.Println("User created successfully!")
	return nil
}

func GetUserByEmail(email string) (*User, error) {
	// Prepare the SELECT statement
	stmt, err := db.Prepare("SELECT id, name, email, password FROM users WHERE email = $1;")
	if err != nil {
		fmt.Println("Failed to create SQL statement")
		return nil, err
	}
	defer stmt.Close()

	// Execute the query and scan the results into a User struct
	user := &User{}
	err = stmt.QueryRow(email).Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Return nil and a custom error if no user was found
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// Return the User struct and nil error if successful
	return user, nil
}

func GetUserByID(id string) (*User, error) {
	// Prepare the SELECT statement
	stmt, err := db.Prepare("SELECT id, name, email, password FROM users WHERE id = $1;")
	if err != nil {
		fmt.Println("Failed to create SQL statement")
		return nil, err
	}
	defer stmt.Close()

	// Execute the query and scan the results into a User struct
	user := &User{}
	err = stmt.QueryRow(id).Scan(&user.ID, &user.Name, &user.Email, &user.Password)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			// Return nil and a custom error if no user was found
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	// Return the User struct and nil error if successful
	return user, nil
}