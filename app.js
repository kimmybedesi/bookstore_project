const API_URL = "https://bookstore-api-six.vercel.app/api/books";
const container = document.getElementById("books-container");
const form = document.getElementById("book-form");
const messageBox = document.getElementById("message");
const loadBtn = document.getElementById("load-books");

// Load books only when button is clicked
loadBtn.addEventListener("click", fetchBooks);

// Fetch and display all books
async function fetchBooks() {
  container.innerHTML = "<p class='text-center text-white'>Loading books...</p>";

  try {
    const response = await fetch(API_URL);
    const books = await response.json();

    container.innerHTML = "";
    books.forEach(displayBook);
  } catch (error) {
    container.innerHTML = `<p class='text-red-500'>Failed to load books: ${error.message}</p>`;
  }
}

// Display a book card
function displayBook(book) {
  const card = document.createElement("div");
  card.classList.add("book-card");

  card.innerHTML = `
  <div class="book-card-image relative">
    <img src="assets/closed-book.png" alt="Pixel Book" class="w-full h-auto scale-150 block" />
    <div class="book-info absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center p-6">
      <h3 class="text-white text-xl font-bold">${book.title}</h3>
      <p class="text-white text-base">by ${book.author}</p>
      <p class="text-white text-base">Year: ${book.year}</p>
      <p class="text-white text-base">Genre: ${book.genre}</p>
      
    <button class="delete-btn mt-2 bg-red-700 hover:bg-red-900 text-white font-['Press_Start_2P'] px-2 py-1 rounded text-xs" data-id="${book._id}">
        Delete
      </button>
    </div>
  </div>
`;

  // Pass the card itself to deleteBook
  card.querySelector(".delete-btn").addEventListener("click", () => {
    deleteBook(book._id, card);
  });

  container.appendChild(card);
}
 
// Add a new book
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newBook = {
    title: form.title.value.trim(),
    author: form.author.value.trim(),
    year: parseInt(form.year.value),
    genre: form.genre.value.trim(),
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newBook),
      headers: { "Content-Type": "application/json" },
    });

    const saved = await res.json();
    displayBook(saved);
    form.reset();
    showMessage("Book added!");
  } catch (error) {
    showMessage("Error adding book.", "error");
  }
});

// Delete book 

async function deleteBook(id, cardElement) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Delete failed: ${errText}`);
    }

    cardElement.remove(); // Remove the visual card
    showMessage("Book deleted successfully!");
  } catch (error) {
    console.error("Delete error:", error);
    showMessage("Error deleting book.", "error");
  }
}

// Show feedback message
function showMessage(msg, type = "success") {
  messageBox.textContent = msg;
  messageBox.className =
    type === "error"
      ? "mt-6 text-center text-red-400 font-semibold font-['Press_Start_2P']"
      : "mt-6 text-center text-green-400 font-semibold font-['Press_Start_2P']";

  setTimeout(() => {
    messageBox.textContent = "";
    messageBox.className = "";
  }, 4000);
}

