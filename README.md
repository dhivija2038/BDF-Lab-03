# Lab 03: REST API, Query Parameters, Validation and Debugging

## Student Details

- **Name:** N Dhivija
- **Registration Number:** 252U1R6112
- **Lab:** Backend Development Fundamentals – Lab 03

---

## 1. Project Overview

This lab focuses on developing REST APIs using Node.js, Express.js and SQLite. The project implements CRUD operations on a Books database along with query parameters, searching, sorting, pagination, price filtering and input validation.

The application allows users to retrieve, add, update and delete book records through HTTP requests.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- SQLite3
- JavaScript
- Postman
- Git and GitHub
- Render (Deployment)
- Visual Studio Code

## 3. Project Structure

```text
lab-03/
│
├── screenshots/
│   ├── get-all-books.png
│   ├── search-books.png
│   ├── sort-books.png
│   ├── pagination-books.png
│   ├── price-filter-books.png
│   ├── post-validation-error.png
│   ├── post-success.png
│   ├── verify-added-book.png
│   ├── put-update-book.png
│   ├── verify-updated-book.png
│   ├── delete-book.png
│   ├── not-found-error.png
│   ├── verify-deleted-book.png
│   ├── port-conflict-error.png
│   ├── wrong-import-path.png
│   ├── table-name-error.png
│   └── missing-await-error.png
│
├── books.db
├── database.js
├── package.json
├── package-lock.json
├── server.js
├── README.md
└── .gitignore
```

## 4. Database Details

The project uses an SQLite database named `books.db`.

**Table Name:** `book`

| Column | Description |
|---|---|
| id | Unique book ID |
| title | Book title |
| author | Author name |
| price | Book price |
| pages | Number of pages |

The database connection is established using the `sqlite` and `sqlite3` packages.

## 5. API Endpoints

The following REST API endpoints are implemented:

| HTTP Method | Endpoint | Operation |
|---|---|---|
| GET | `/books/` | Retrieve all books |
| GET | `/books/:bookId/` | Retrieve a single book |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update an existing book |
| DELETE | `/books/:bookId/` | Delete a book |

### Query Parameters

The GET `/books/` endpoint supports the following query parameters:

| Parameter | Description |
|---|---|
| search_q | Search books by title |
| order_by | Sort using a permitted column |
| order | Sort in ASC or DESC order |
| limit | Maximum number of records |
| offset | Number of records to skip |
| min_price | Minimum book price |
| max_price | Maximum book price |

**Example Requests:**

Search books:
```text
GET /books/?search_q=Python
```

Sort books:
```text
GET /books/?order_by=price&order=DESC
```

Pagination:
```text
GET /books/?limit=5&offset=0
```

Price filtering:
```text
GET /books/?min_price=100&max_price=500
```

## 6. Input Validation and Error Handling

Input validation is implemented to ensure that the API receives valid data.

The following validations are performed:

- Title and author must not be empty.
- Price must be a valid numeric value.
- Pages must be a positive integer when provided.
- Invalid sorting columns are rejected.
- Sorting order must be ASC or DESC.
- Limit and offset must contain valid integer values.
- Minimum price must not exceed maximum price.
- A 404 response is returned when a requested book does not exist.
- Invalid JSON requests are handled with an appropriate error response.
- Internal server errors are handled using try-catch blocks.

## 7. Testing Using Postman

All API operations were tested using Postman.

The following test cases were performed:

1. Retrieving all books.
2. Searching books using query parameters.
3. Sorting books by different columns.
4. Implementing pagination using limit and offset.
5. Filtering books based on price.
6. Adding a new book with valid data.
7. Checking validation errors for invalid input.
8. Updating an existing book.
9. Deleting a book.
10. Verifying the updated and deleted records.
11. Testing not-found error responses.

Screenshots of the API requests and responses are available in the `screenshots` folder.

## 8. Challenges Faced

During the development process, I encountered some errors related to incorrect import paths, database table names, missing await statements and port conflicts. I resolved these issues by checking the file paths, verifying SQL table names, using async/await correctly and managing the server process.

These debugging experiences helped me understand common backend development problems and how to solve them.

## 9. Learning Outcomes

Through this lab, I learned how to develop REST APIs using Express.js, handle different HTTP methods, connect an SQLite database, perform CRUD operations, implement query parameters, search and sort records, apply pagination and price filtering, validate user inputs and handle errors.

I also gained practical experience in testing APIs using Postman, managing code through Git and GitHub, and deploying a Node.js application using Render.

## 10. Live Deployment

The application is deployed using Render.

**Live Application URL:**

https://bdf-lab-03-cmji.onrender.com

**Test API:**

https://bdf-lab-03-cmji.onrender.com/books/

## 11. GitHub Repository

**GitHub Repository:**

https://github.com/dhivija2038/BDF-Lab-03

---

**Conclusion**

This lab provided practical experience in backend development by building and testing REST APIs with Node.js, Express.js and SQLite. It improved my understanding of database connectivity, CRUD operations, query parameters, validation, debugging, API testing and application deployment.
