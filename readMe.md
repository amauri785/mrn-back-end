🛠 1. Install Dependencies

We installed these packages:

express → to create the API server.

mongoose → to connect to MongoDB and create models (User, Book).

bcryptjs → to hash and verify passwords (so we don’t store plain text passwords).

jsonwebtoken (jwt) → to generate and verify tokens for authentication.

dotenv → to store sensitive values like database URL and JWT secret in .env file.

Command:

npm install express mongoose bcryptjs jsonwebtoken dotenv

📦 2. Setup .env

We used environment variables to keep secrets safe:

PORT=5000
MONGODB_URL=mongodb://127.0.0.1:27017/authdb
JWT_SECRET=supersecretkey


MONGODB_URL → tells Mongoose where to connect.

JWT_SECRET → key to sign and verify tokens (keep it private).

PORT → the server port.

👤 3. Create User Schema (Model)

We created a User collection in MongoDB with fields:

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


username and email must be unique.

password will store hashed password, not plain text.

🔐 4. Register Endpoint (/register)
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // check if user exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // save user
  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: "User registered successfully!" });
});


📌 Here:

bcrypt.hash() adds salt and hashes the password.

We save the hashed password into MongoDB.

🔑 5. Login Endpoint (/login)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // create JWT token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});


📌 Here:

bcrypt.compare() checks plain text password with hashed one.

jwt.sign() creates a token containing the user’s id.

Token expires in 1 hour.

🛡 6. Middleware to Protect Routes

We created authMiddleware:

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next(); // move to route
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
}


📌 Here:

We check if request has an Authorization header with a token.

If valid, decode it using jwt.verify().

Attach decoded user info to req.user.

If not valid, return 401 or 403.

📚 7. Protect Book Routes

We added authMiddleware to certain routes:

app.post('/books', authMiddleware, async (req, res) => { ... });
app.put('/books/:id', authMiddleware, async (req, res) => { ... });
app.delete('/books/:id', authMiddleware, async (req, res) => { ... });


📌 This means:

Anyone can read books (GET /books).

Only logged-in users with a valid token can create, update, or delete books.

🚀 8. How it Works (Flow)

Register → user signs up, password gets hashed, stored in MongoDB.

Login → user logs in, password is checked, JWT token is generated.

Token usage → client (frontend or Postman) sends token in headers:

Authorization: Bearer <your_token>


Middleware → verifies token. If valid, allows request to continue.

Protected routes → only work if request has a valid token.

✅ With this, we now have a secure authentication system:

No plain text passwords.

JWT protects access.

Middleware ensures only authenticated users can change data.




hey in simple way look at this simple logic of authentication and book management app and create a back-end server logi c with files/folders to store and organize all 



Recommended Project Structure
your-project/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema/model
│   │   └── Book.js              # Book schema/model
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Register/login routes
│   │   └── books.js             # Book CRUD routes
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── bookController.js    # Book operations logic
│   └── app.js                   # Main app setup
├── server.js                    # Server entry point
├── .env                         # Environment variables
├── .gitignore
└── package.json
How to Split Your Current Code
1. Database Connection (src/config/database.js)

Move MongoDB connection logic here
Export connection function

2. Models (src/models/)

User.js - User schema and model
Book.js - Book schema and model

3. Middleware (src/middleware/auth.js)

Move your authMiddleware function here

4. Controllers (src/controllers/)

authController.js - Register and login logic
bookController.js - All book CRUD operations

5. Routes (src/routes/)

auth.js - Authentication routes (register, login)
books.js - Book routes (GET, POST, PUT, DELETE)

6. Main App (src/app.js)

Express app setup
Middleware configuration
Route mounting

7. Server Entry (server.js)

Start server
Database connection
Error handling

Benefits of This Structure

Separation of Concerns: Each file has a single responsibility
Maintainability: Easy to find and modify specific functionality
Scalability: Easy to add new features without cluttering
Testing: Each module can be tested independently
Team Collaboration: Multiple developers can work on different parts
Code Reusability: Controllers and middleware can be reused

This MVC-like pattern (Model-View-Controller, though you don't have views in an API) is widely adopted in Node.js applications and will make your code much more professional and maintainable.