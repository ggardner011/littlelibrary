package models

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
)

type Book struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	CreatedAt      time.Time      `gorm:"not null" json:"created_at"`
	UpdatedAt      time.Time      `gorm:"not null" json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
	Title          string         `gorm:"not null" json:"title"`
	Author         string         `gorm:"not null" json:"author"`
	ISBN           string         `gorm:"uniqueIndex;not null" json:"isbn"`
	PublishingDate Date           `gorm:"not null" json:"publishing_date"`
	TotalCopies    uint           `gorm:"not null" json:"total_copies"`
	AddedBy        uint           `gorm:"not null" json:"added_by,omitempty"`

	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:AddedBy" json:"user,omitempty"`
}

// ////////////////////////////Create new book
func CreateBook(b *Book) (*Book, error) {
	// Get the GORM database connection.
	db := getDB()
	b.ISBN = strings.ToLower(b.ISBN)
	// Create the user using GORM.
	result := db.Preload("User").Where("isbn = ?", b.ISBN).FirstOrCreate(b)
	if result.Error != nil {
		fmt.Println("Failed to create book")
		return nil, result.Error
	}

	// If no records found, return nil
	if result.RowsAffected == 0 {
		return b, errors.New("Book with this ISBN already exists")
	}

	fmt.Println("Book created successfully!")
	return b, nil
}

// ////////////////////////////Create new book
func UpsertBook(b *Book) (*Book, error) {
	// Get the GORM database connection.
	db := getDB()
	b.ISBN = strings.ToLower(b.ISBN)
	//get values for update
	updated := *b

	// Create the user using GORM.
	result := db.Preload("User").Where("isbn = ?", b.ISBN).FirstOrCreate(b)
	if result.Error != nil {
		fmt.Println("Failed to create book")
		return nil, result.Error
	}

	//If no records found, update
	if result.RowsAffected == 0 {
		result := db.Preload("User").Model(b).Where("isbn = ?", b.ISBN).Updates(updated)
		if result.Error != nil {
			fmt.Println("Failed to update book")
			return nil, result.Error
		}

		return b, nil
	}

	fmt.Println("Book updated successfully!")
	return b, nil
}

// ///////////////////////////////////////////////
// /Search for book
func GetBook(b *Book) (*Book, error) {
	// Get the GORM database connection.
	db := getDB()

	b.ISBN = strings.ToLower(b.ISBN)
	result := db.Preload("User").Where(b).Limit(1).Find(b)
	err := result.Error
	if err != nil {
		return nil, err
	}
	//If no records found, return nil
	if result.RowsAffected == 0 {
		return nil, nil
	}
	// Return the User struct and nil error if successful.
	return b, nil

}

// FindSimilarBooks searches for books with similar Title, Author, and ISBN based on the provided Book struct
// and a similarity threshold. The results are ordered by the highest average similarity.
func GetBooks(b *Book, c int) ([]Book, error) {
	// Get the GORM database connection.
	db := getDB()

	var books []Book

	// Count the number of non-empty fields to calculate the average similarity
	nonEmptyFieldCount := 0
	titleSimilarity := "0"
	authorSimilarity := "0"
	isbnSimilarity := "0"
	queryParameters := []interface{}{}

	// Update the similarity expressions and nonEmptyFieldCount for non-empty fields in the Book struct
	if b.Title != "" {
		nonEmptyFieldCount++
		titleSimilarity = "similarity(title, ?)"
		queryParameters = append(queryParameters, b.Title)
	}
	if b.Author != "" {
		nonEmptyFieldCount++
		authorSimilarity = "similarity(author, ?)"
		queryParameters = append(queryParameters, b.Author)
	}
	if b.ISBN != "" {
		nonEmptyFieldCount++
		isbnSimilarity = "similarity(isbn, ?)"
		queryParameters = append(queryParameters, b.ISBN)
	}

	// If all fields are empty, return an empty result
	if nonEmptyFieldCount == 0 {
		return books, nil
	}

	// Generate the SELECT query string with the proper similarity expressions
	selectQuery := fmt.Sprintf(`
		books.*,
		((%s) + (%s) + (%s)) / ? as avg_similarity
	`, titleSimilarity, authorSimilarity, isbnSimilarity)

	// Build the query to find similar books based on the average similarity
	query := db.Model(&Book{}).Preload("User").Select(selectQuery, append(queryParameters, float64(nonEmptyFieldCount))...)
	result := query.Order("avg_similarity DESC").Limit(c).Find(&books)

	// Handle any errors that occur during the query execution
	if result.Error != nil {
		return nil, result.Error
	}

	// Return the books ordered by the highest average similarity
	return books, nil
}
