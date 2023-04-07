package models

import (
	"fmt"

	_ "github.com/lib/pq"
)

type Post struct {
	ID      string
	Text    string `json:"text"`
	User_ID string `json:"user_id"`
}

func CreatePost(post Post) error {
	// Get the database connection.
	db := getDB()

	// Prepare the SQL statement.
	stmt, err := db.Prepare("INSERT INTO posts (text, user_id) VALUES ($1, $2);")
	if err != nil {
		fmt.Println("Failed to create SQL statement")
		return err
	}
	defer stmt.Close()

	// Execute the SQL statement with the user data.
	_, err = stmt.Exec(post.Text, post.User_ID)
	if err != nil {
		fmt.Println("Failed to execute SQL statement")
		return err
	}

	fmt.Println("User created successfully!")
	return nil
}
