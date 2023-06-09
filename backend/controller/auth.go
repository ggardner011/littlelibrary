package controller

import (
	"fmt"
	"myapp/models"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-chi/jwtauth/v5"

	"github.com/golang-jwt/jwt/v5"
)

func CreateUserToken(user *models.User) (string, error) {
	// Replace "my-secret-key" with your actual secret key
	signingKey := []byte(os.Getenv("JWT_SECRET"))

	// Create the JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":   strings.ToLower(user.Email),
		"id":      user.ID,
		"isadmin": user.IsAdmin,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	// Sign the token with the secret key
	tokenString, err := token.SignedString(signingKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Get user associated with the verified JWT passed via the reuqest context. Returns data for user from the Database
func GetUserClaims(w http.ResponseWriter, r *http.Request) (*models.User, bool) {
	// Retrieve the JWT claims from the request context
	_, claims, err := jwtauth.FromContext(r.Context())
	if err != nil {
		fmt.Printf("Could net get context")
		return nil, false
	}

	// Access the JWT claims
	idFloat, ok := claims["id"].(float64)
	if !ok {
		fmt.Printf("Could net get email clain as string")
		return nil, ok
	}

	// Access the JWT claims
	email, ok := claims["email"].(string)
	if !ok {
		fmt.Printf("Could net get ID clain as uint")
		return nil, ok
	}

	// Access the JWT claims
	isadmin, ok := claims["isadmin"].(bool)
	if !ok {
		fmt.Printf("Could net get isadmin claim as string")
		return nil, ok
	}

	//convert id back to uint
	id := uint(idFloat)

	user := &models.User{ID: id, Email: email, IsAdmin: isadmin}

	return user, true
}
