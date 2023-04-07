package handler

import (
	"context"
	"fmt"
	"myapp/config"
	"myapp/models"
	"net/http"
	"strings"
	"time"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const jwtContextKey contextKey = contextKey("jwtClaims")

func CreateUserToken(user *models.User) (string, error) {
	// Replace "my-secret-key" with your actual secret key
	signingKey := []byte(config.JWT_SECRET)

	// Create the JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"id":    user.ID,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	// Sign the token with the secret key
	tokenString, err := token.SignedString(signingKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

//Middleware to validate JWT Bearer token from header and 
func JwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Invalid authroization",http.StatusUnauthorized)
			return
		}

		// Parse the JWT token
		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("invalid token signing method")
			}
			// Replace "my-secret-key" with your actual secret key
			return []byte(config.JWT_SECRET), nil
		})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Check if the token is valid
		if !token.Valid {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}

		// Add the JWT claims to the request context
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Failed to create claim", http.StatusInternalServerError)
			return
		}
		ctx := context.WithValue(r.Context(), jwtContextKey, claims)
		r = r.WithContext(ctx)

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

func getUserClaims(w http.ResponseWriter, r *http.Request) (*models.User, bool) {
	// Retrieve the JWT claims from the request context
	claims, ok := r.Context().Value(jwtContextKey).(jwt.MapClaims)
	if !ok {
		return nil, ok
	}

	// Access the JWT claims
	email, ok := claims["email"].(string)
	if !ok {
		return nil, ok
	}

	// Access the JWT claims
	id, ok := claims["id"].(string)
	if !ok {
		return nil, ok
	}
	user := models.User{Email: email, ID: id}
	return &user, true
}
