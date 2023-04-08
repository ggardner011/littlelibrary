package models

import (
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

// Function to connect to the database and store the connection in the global variable.
func ConnectDB(connStr string) error {

	// Open a connection to the database.
	var err error
	dialector := postgres.Open(connStr)
	db, err = gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		return err
	}

	// Test the connection to make sure it's working.
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	err = sqlDB.Ping()
	if err != nil {
		return err
	}

	// Run the migrations.
	err = db.AutoMigrate(&User{})
	if err != nil {
		panic("Failed to migrate")
	}

	exists, err := UserExistsByEmail("admin@admin.com")
	if err != nil {
		panic("Failed to check if admin user exists")
	}

	// Create an admin user if does not exist
	if !(exists) {
		admin := &User{
			Name:     "Admin",
			Email:    "ADMIN@admin.com",
			Password: os.Getenv("ADMIN_PASSWORD"),
			IsAdmin:  true,
		}
		result := db.Create(admin)
		if result.Error != nil {
			panic("Failed to create admin user!")
		}
	}
	fmt.Println("Successfully connected to database!")
	return nil
}

// Function to get the database connection.
func getDB() *gorm.DB {
	return db
}
