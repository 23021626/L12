const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');

// Set up view engine
app.set('view engine', 'ejs');
// Enable static files
app.use(express.static('public'));
// Enable form processing
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'db4free.net',
    user: 'rusername_created_for_db4free.net',
    password: 'password_created_for_db4free.net',
    database: 'databaseName_created.for_db4free.net'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Define routes
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Error retrieving products');
        }
        res.render('index', { products: results });
    });
});

app.get('/cart', (req, res) => {
    res.render('editshoppingcart');
});

app.post('/cart', (req, res) => {
    let { product_id, quantity } = req.body;
    let sql = 'INSERT INTO shopping_cart (user_id, product_id, quantity) VALUES (1, ?, ?)';
    db.query(sql, [product_id, quantity], (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Error adding to cart');
        }
        res.redirect('/cart');
    });
});

app.get('/payment', (req, res) => {
    res.render('payment');
});

app.post('/payment', (req, res) => {
    let { total_price } = req.body;
    let sql = 'INSERT INTO orders (user_id, total_price, status, order_date) VALUES (1, ?, "Processing", NOW())';
    db.query(sql, [total_price], (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Error processing payment');
        }
        res.redirect('/ordertracking');
    });
});

app.get('/ordertracking', (req, res) => {
    let sql = 'SELECT * FROM orders WHERE user_id = 1';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Error retrieving orders');
        }
        res.render('ordertracking', { orders: results });
    });
});

app.get('/orderhistory', (req, res) => {
    let sql = 'SELECT * FROM orders WHERE user_id = 1';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Error retrieving order history');
        }
        res.render('orderhistory', { orders: results });
    });
});

app.get('/account', (req, res) => {
    let sql = 'SELECT * FROM users WHERE user_id = 1';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).send('Error retrieving account');
        }
        res.render('account', { user: result[0] });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
