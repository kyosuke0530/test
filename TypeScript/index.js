const books = [
  { title: "TypeScript入門", author: "田中太郎", available: true },
  { title: "JavaScript基礎", author: "山田花子", available: false },
  { title: "Reactと実践", author: "鈴木一郎", available: true },  
]

const borrowedBooks = []
let newBookId = 1

function addNewBook(book) {
  books.push(book)
  return book
}

function borrowedBook(title) {
  const selectedBook = books.find(book => book.title === title && book.available)
  selectedBook.available = false
  const newBorrowedBook = { id: newBookId++, book: selectedBook, status: "borrowed" }
  borrowedBooks.push(newBorrowedBook)
  return selectedBook.status = ""
}

function returnBook(bookId) {
  const selectedBook = borrowedBooks.find(book => book.id === bookId)
  selectedBook.book.available = true
  selectedBook.status = "returned"
  return selectedBook
}

addNewBook({ title: "Pythonで学ぶデータサイエンス", author: "伊藤花子", return: true })
addNewBook({ title: "Vue.js入門", author: "鈴木一郎", return: true })

borrowedBook("TypeScript入門")
returnBook(1)

console.log(books)
console.log(borrowedBooks)