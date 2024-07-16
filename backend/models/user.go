package models

import (
	"errors"
	"fmt"
	"time"
	"strings"
	"gorm.io/gorm"
	_ "github.com/lib/pq"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Email     string         `gorm:"uniqueIndex" json:"email"`
	Password  string         `json:"password,omitempty"`
	IsAdmin   bool           `gorm:"default:false" json:"isadmin"`
	CreatedAt time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt time.Time      `gorm:"not null" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	u.Email = strings.ToLower(u.Email)
	return nil
}

func CreateUser(user *User) (*User, error) {
	// Get the GORM database connection.
	db := getDB()

	// Create the user using GORM.
	result := db.Create(user)
	if result.Error != nil {
		fmt.Println("Failed to create user")
		return nil, result.Error
	}

	fmt.Println("User created successfully!")
	return user, nil
}

func GetUserByEmail(email string) (*User, error) {
	// Get the GORM database connection.
	db := getDB()

	// Find the user by email using GORM.
	user := &User{}
	result := db.Where("email = ?", strings.ToLower(email)).Limit(1).Find(user)
	err := result.Error
	if err != nil {
		return nil, err
	}
	//If no records found, return nil
	if result.RowsAffected == 0 {
		return nil, nil
	}
	// Return the User struct and nil error if successful.
	return user, nil

}

func GetUserByID(id uint) (*User, error) {
	// Get the GORM database connection.
	db := getDB()

	// Find the user by ID using GORM.
	user := &User{}
	result := db.Limit(1).Find(user, id)
	err := result.Error
	if err != nil {
		return nil, err
	}
	//If no records found, return nil
	if result.RowsAffected == 0 {
		return nil, nil
	}

	// Return the User struct and nil error if successful.
	return user, nil
}

func GrantAdminAccess(email string) error {
	user, err := GetUserByEmail(email)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	err = db.Model(&User{}).Where("email = ?", email).Updates(map[string]interface{}{"IsAdmin": true}).Error
	if err != nil {
		return err
	}
	return nil
}

// Searches for users with similar names or emails based on a
//  similarity threshold. The results are ordered by the highest average similarity.
func GetUsers(u *User, c int) ([]User, error) {
	// Get the GORM database connection.
	db := getDB()

	var users []User

	// Count the number of non-empty fields to calculate the average similarity
	nonEmptyFieldCount := 0
	queryParameters := []interface{}{}
	queryStrings := []string{}

	// Update the similarity expressions and nonEmptyFieldCount for non-empty fields in the User struct
	if u.Name != "" {
		nonEmptyFieldCount++
		queryStrings = append(queryStrings, "similarity(name, ?)")
		queryParameters = append(queryParameters, u.Name)
	}
	if u.Email != "" {
		nonEmptyFieldCount++
		queryStrings = append(queryStrings, "similarity(email, ?)")
		queryParameters = append(queryParameters, u.Email)
	}

	// If all fields are empty, return an empty result
	if nonEmptyFieldCount == 0 {
		return users, nil
	}

	//Add the threshhold to the similarity search for each individual category
	whereStrings := make([]string, len(queryStrings))
	for i, val := range queryStrings {
		whereStrings[i] = val + " > .20"
	}

	//Construct queries by appending Query conditions
	selectQuery := `users.*, ` + `(` + strings.Join(queryStrings, " + ") + `) AS avg_similarity`
	whereQuery := strings.Join(whereStrings, " OR ")
	fmt.Println(selectQuery, whereQuery)
	// Build the query to find similar books based on the average similarity
	query := db.Model(&User{}).Select(selectQuery, queryParameters...)
	query = query.Where(whereQuery, queryParameters...).Order("avg_similarity DESC").Limit(c)
	result := query.Find(&users)

	// Handle any errors that occur during the query execution
	if result.Error != nil {
		return nil, result.Error
	}

	// Return the books ordered by the highest average similarity
	return users, nil
}
