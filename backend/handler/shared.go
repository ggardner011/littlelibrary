package handler

type Response struct {
	Token   string `json:"token,omitempty"`
	Message string `json:"message,omitempty"`
}