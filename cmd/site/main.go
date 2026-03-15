package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

type PageData struct {
	Title string
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4173"
	}

	tmpl := template.Must(template.ParseFiles("templates/index.html"))

	mux := http.NewServeMux()
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		data := PageData{Title: "Rich Robertson | Software Engineer"}
		if err := tmpl.Execute(w, data); err != nil {
			log.Printf("template render error: %v", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
	})

	addr := ":" + port
	log.Printf("server listening on http://localhost%s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatal(err)
	}
}
