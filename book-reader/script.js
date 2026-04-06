document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");
    const pdfIframe = document.getElementById("pdf-iframe");

    // Fetch the list of books dynamically
    fetch("books")
        .then(response => {
            if (!response.ok) throw new Error("Books directory not available");
            return response.json();
        })
        .then(books => {
            bookList.innerHTML = ""; // Clear the existing list
            books.forEach(book => {
                if (book.endsWith(".pdf")) { // Ensure only PDFs are added
                    const listItem = document.createElement("li");
                    listItem.setAttribute("data-pdf-path", `books/${book}`);
                    listItem.textContent = book.replace(/_/g, " ").replace(".pdf", ""); // Format name
                    listItem.addEventListener("click", () => {
                        pdfIframe.src = `books/${book}`; // Load PDF in iframe
                    });
                    bookList.appendChild(listItem);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            bookList.innerHTML = "<li>Book directory not found or empty.</li>";
        });
});