package main

import (
	"log"
	"myapp/config"
	"myapp/handler"
	"myapp/models"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {

	//Connect to database using connection string
	err := models.ConnectDB(config.POSTGRESS_CONNECTION)
	if err != nil {
		panic(err)
	}

	r := chi.NewRouter()

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, world!"))
	})

	r.Group(func(r chi.Router) {

	})

	//Post using the User Schema as body
	r.Post("/api/users/register", handler.CreateUserHandler)
	r.Post("/api/users/login", handler.LoginUserHandler)

	//Secured Routes
	r.Group(func(r chi.Router) {
		r.Use(handler.JwtMiddleware)
		r.Get("/api/users/me", handler.GetSelfHandler)
	})

	log.Fatal(http.ListenAndServe(config.PORT, r))
}
