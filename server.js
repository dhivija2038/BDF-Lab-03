const express = require('express');
const openDatabase = require('./database');  

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

let db;

// Initialize database and start server
const initializeDBAndServer = async () => {
    try {
        db = await openDatabase();

        app.listen(PORT, () => {
            console.log(`Server Running at http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

// GET: Retrieve books with search, sorting, pagination and price filter
app.get('/books/', async (request, response) => {
    try {
        const {
            search_q = '',
            order_by = 'id',
            order = 'ASC',
            limit = '10',
            offset = '0',
            min_price,
            max_price
        } = request.query;

        const allowedColumns = ['id', 'title', 'author', 'price', 'pages'];

        if (!allowedColumns.includes(order_by)) {
            return response.status(400).send({
                message: 'Invalid order_by column'
            });
        }

        const sortOrder = order.toUpperCase();

        if (!['ASC', 'DESC'].includes(sortOrder)) {
            return response.status(400).send({
                message: 'Order must be ASC or DESC'
            });
        }

        const pageLimit = Number(limit);
        const pageOffset = Number(offset);

        if (
            !Number.isInteger(pageLimit) ||
            pageLimit <= 0 ||
            !Number.isInteger(pageOffset) ||
            pageOffset < 0
        ) {
            return response.status(400).send({
                message: 'Invalid limit or offset'
            });
        }

        const conditions = [];
        const params = [];

        if (search_q.trim() !== '') {
            conditions.push('title LIKE ?');
            params.push(`%${search_q}%`);
        }

        if (min_price !== undefined) {
            const min = Number(min_price);

            if (!Number.isFinite(min)) {
                return response.status(400).send({
                    message: 'Invalid minimum price'
                });
            }

            conditions.push('price >= ?');
            params.push(min);
        }

        if (max_price !== undefined) {
            const max = Number(max_price);

            if (!Number.isFinite(max)) {
                return response.status(400).send({
                    message: 'Invalid maximum price'
                });
            }

            conditions.push('price <= ?');
            params.push(max);
        }

        if (min_price !== undefined && max_price !== undefined) {
            if (Number(min_price) > Number(max_price)) {
                return response.status(400).send({
                    message: 'Minimum price cannot exceed maximum price'
                });
            }
        }

        let query = 'SELECT * FROM book';

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;

        params.push(pageLimit, pageOffset);

        const books = await db.all(query, params);

        response.status(200).send(books);

    } catch (error) {
        response.status(500).send({
            message: 'Internal server error'
        });
    }
});

// GET: Retrieve a single book by ID
app.get('/books/:bookId/', async (request, response) => {
    try {
        const { bookId } = request.params;

        const book = await db.get(
            'SELECT * FROM book WHERE id = ?',
            [bookId]
        );

        if (book === undefined) {
            return response.status(404).send({
                message: 'Book not found'
            });
        }

        response.status(200).send(book);

    } catch (error) {
        response.status(500).send({
            message: 'Internal server error'
        });
    }
});

// POST: Add a new book with validation
app.post('/books/', async (request, response) => {
    try {
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== 'string' ||
            title.trim() === '' ||
            typeof author !== 'string' ||
            author.trim() === '' ||
            price === undefined ||
            price === null ||
            typeof price === 'boolean' ||
            (typeof price !== 'number' && typeof price !== 'string') ||
            String(price).trim() === '' ||
            !Number.isFinite(Number(price))
        ) {
            return response.status(400).send({
                message: 'Title, author and valid numeric price are required'
            });
        }

        if (
            pages !== undefined &&
            (!Number.isInteger(Number(pages)) || Number(pages) <= 0)
        ) {
            return response.status(400).send({
                message: 'Pages must be a positive number'
            });
        }

        const result = await db.run(
            'INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)',
            [title.trim(), author.trim(), Number(price), pages ?? null]
        );

        response.status(201).send({
            bookId: result.lastID,
            message: 'Book added successfully'
        });

    } catch (error) {
        response.status(500).send({
            message: 'Internal server error'
        });
    }
});

// PUT: Update an existing book
app.put('/books/:bookId/', async (request, response) => {
    try {
        const { bookId } = request.params;
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== 'string' ||
            title.trim() === '' ||
            typeof author !== 'string' ||
            author.trim() === '' ||
            price === undefined ||
            price === null ||
            typeof price === 'boolean' ||
            (typeof price !== 'number' && typeof price !== 'string') ||
            String(price).trim() === '' ||
            !Number.isFinite(Number(price))
        ) {
            return response.status(400).send({
                message: 'Title, author and valid numeric price are required'
            });
        }

        const result = await db.run(
            'UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?',
            [title.trim(), author.trim(), Number(price), pages ?? null, bookId]
        );

        if (result.changes === 0) {
            return response.status(404).send({
                message: 'Book not found'
            });
        }

        response.status(200).send({
            message: 'Book updated successfully'
        });

    } catch (error) {
        response.status(500).send({
            message: 'Internal server error'
        });
    }
});

// DELETE: Remove a book
app.delete('/books/:bookId/', async (request, response) => {
    try {
        const { bookId } = request.params;

        const result = await db.run(
            'DELETE FROM book WHERE id = ?',
            [bookId]
        );

        if (result.changes === 0) {
            return response.status(404).send({
                message: 'Book not found'
            });
        }

        response.status(200).send({
            message: 'Book deleted successfully'
        });

    } catch (error) {
        response.status(500).send({
            message: 'Internal server error'
        });
    }
});

// Handle invalid JSON
app.use((error, request, response, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return response.status(400).send({
            message: 'Invalid JSON format'
        });
    }

    next(error);
});

// Initialize database and start server
initializeDBAndServer();
