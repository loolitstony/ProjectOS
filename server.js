const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017'; // или URI към твоя MongoDB Atlas
const client = new MongoClient(uri);
let db;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}));

(async () => {
  await client.connect();
  db = client.db('RestaurantDB');
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
})();

// Home redirect
app.get('/', (req, res) => res.redirect('/menu'));

// Signup
app.get('/signup', (req, res) => res.render('signup'));

app.post('/signup', async (req, res) => {
  const { name, phone, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.collection('Customers').insertOne({ name, phone, password: hash, allergies: [] });
  res.redirect('/login');
});

// Login
app.get('/login', (req, res) => res.render('login'));

app.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  const user = await db.collection('Customers').findOne({ phone });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/menu');
  } else {
    res.send('Invalid credentials');
  }
});

// Menu
app.get('/menu', async (req, res) => {
  const items = await db.collection('MenuItems').find().toArray();
  res.render('menu', { items, userId: req.session.userId });
});

// Orders
app.get('/orders', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const orders = await db.collection('Orders').find({ customer_id: req.session.userId }).toArray();
  res.render('orders', { orders });
});

app.post('/orders', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');

  const { item_id, quantity } = req.body;
  const item = await db.collection('MenuItems').findOne({ _id: new ObjectId(item_id) });
  const total = item.price * Number(quantity);

  await db.collection('Orders').insertOne({
    customer_id: req.session.userId,
    items: [{ item_id: item._id, quantity: Number(quantity) }],
    total: total,
    status: "Pending",
    table: null,
    timestamp: new Date()
  });

  res.redirect('/orders');
});
