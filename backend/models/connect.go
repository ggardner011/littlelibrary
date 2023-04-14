package models

import (
	"fmt"
	"os"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
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

	// Enable the pg_trgm extension
	err = db.Exec("CREATE EXTENSION IF NOT EXISTS pg_trgm").Error
	if err != nil {
		fmt.Println("Error creating pg_trgm extension:", err)
	}

	// Run the migrations.
	err = db.AutoMigrate(&User{})
	if err != nil {
		panic("Failed to migrate")
	}
	err = db.AutoMigrate(&Book{})
	if err != nil {
		panic("Failed to migrate")
	}
	///Create Trigram indexes on fields used for search
	db.Exec("CREATE INDEX IF NOT EXISTS idx_books_title_trgm ON books USING gin(title gin_trgm_ops)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_books_author_trgm ON books USING gin(author gin_trgm_ops)")
	db.Exec("CREATE INDEX IF NOT EXISTS idx_books_isbn_trgm ON books USING gin(isbn gin_trgm_ops)")

	user, err := GetUserByEmail("admin@admin.com")
	if err != nil {
		panic("Failed to check if admin user exists")
	}

	// Create an admin user if does not exist
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(os.Getenv("ADMIN_PASSWORD")), bcrypt.DefaultCost)
	if user == nil {
		admin := &User{
			Name:     "Admin",
			Email:    "ADMIN@admin.com",
			Password: string(hashedPassword),
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
