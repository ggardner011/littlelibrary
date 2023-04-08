package models

import (
	"errors"
	"fmt"

	"time"

	"gorm.io/gorm"
	"strings"

	_ "github.com/lib/pq"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Email     string         `gorm:"uniqueIndex" json:"email"`
	Password  string         `json:"password,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	IsAdmin   bool           `gorm:"default:false"`
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	u.Email = strings.ToLower(u.Email)
	return nil
}

func CreateUser(user User) error {
	// Get the GORM database connection.
	db := getDB()

	// Create the user using GORM.
	result := db.Create(&user)
	if result.Error != nil {
		fmt.Println("Failed to create user")
		return result.Error
	}

	fmt.Println("User created successfully!")
	return nil
}

func GetUserByEmail(email string) (*User, error) {
	// Get the GORM database connection.
	db := getDB()

	// Find the user by email using GORM.
	user := &User{}
	result := db.Where("email = ?", email).First(user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// Return nil and a custom error if no user was found.
			return nil, errors.New("user not found")
		}
		return nil, result.Error
	}

	// Return the User struct and nil error if successful.
	return user, nil
}

func GetUserByID(id uint) (*User, error) {
	// Get the GORM database connection.
	db := getDB()

	// Find the user by ID using GORM.
	user := &User{}
	result := db.First(user, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// Return nil and a custom error if no user was found.
			return nil, errors.New("user not found")
		}
		return nil, result.Error
	}

	// Return the User struct and nil error if successful.
	return user, nil
}

func UserExistsByEmail(email string) (bool, error) {
	// Get the GORM database connection.
	db := getDB()

	// Find the user by email using GORM.
	var count int64
	result := db.Model(&User{}).Where("email = ?", email).Count(&count)
	if result.Error != nil {
		// Return false and the error if there's an issue with the query.
		return false, result.Error
	}

	// Return true if count is greater than 0, indicating a user exists with the given email.
	return count > 0, nil
}


