package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"myapp/handler"
	"myapp/models"
	"net/http"
	"os"

	"github.com/go-chi/jwtauth/v5"
	"github.com/joho/godotenv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

//go:embed reactbuild/*
var static embed.FS

func main() {

	//import ENV file
	// Load environment variables from the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	//Connect to database using connection string
	postgresDB := os.Getenv("POSTGRES_DB")
	postgresUser := os.Getenv("POSTGRES_USER")
	postgresPassword := os.Getenv("POSTGRES_PASSWORD")
	postgresPort := os.Getenv("POSTGRES_PORT")
	postgresHost := os.Getenv("POSTGRES_HOST")

	// Construct the connection string
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=disable TimeZone=UTC",
		postgresUser, postgresPassword, postgresDB, postgresHost, postgresPort)

	err = models.ConnectDB(dsn)
	if err != nil {
		panic(err)
	}
	//Instantiate router and add middleware
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Serve static files from the embedded FS
	sub, err := fs.Sub(static, "reactbuild")
	if err != nil {
		panic(err)
	}

	r.Handle("/*", http.FileServer(http.FS(sub)))

	//Post using the User Schema as body
	r.Post("/api/users/register", handler.CreateUserHandler)
	r.Post("/api/users/login", handler.LoginUserHandler)

	//create Auth middleware
	tokenAuth := jwtauth.New("HS256", []byte(os.Getenv("JWT_SECRET")), nil)
	//Secured Routes
	r.Group(func(r chi.Router) {
		//Add token sent in request to context
		r.Use(jwtauth.Verifier(tokenAuth))
		//Validate token and pass claims to subsequnet requests
		r.Use(jwtauth.Authenticator(tokenAuth))
		r.Get("/api/users/me", handler.GetSelfHandler)
		r.Post("/api/users/grantadmin", handler.AddAdminHandler)
		r.Post("/api/books", handler.CreateBookHandler)
		r.Put("/api/books", handler.UpsertBookHandler)
		r.Get("/api/books", handler.GetBookHandler)
		r.Get("/api/books/search", handler.SearchBooksHandler)
	})

	log.Fatal(http.ListenAndServe(os.Getenv("PORT"), r))
}
