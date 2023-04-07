package models

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

var db *sql.DB

// Function to connect to the database and store the connection in the global variable.
func ConnectDB(connStr string ) error {

	// Open a connection to the database.
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	// Test the connection to make sure it's working.
	err = db.Ping()
	if err != nil {
		return err
	}

	fmt.Println("Successfully connected to database!")
	return nil
}

// Function to get the database connection.
func getDB() *sql.DB {
	return db
}
