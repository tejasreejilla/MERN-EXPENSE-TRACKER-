# Income & Expense Tracker - MERN Stack

A full-featured Income & Expense Tracker web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Track your finances with beautiful visualizations including pie charts, bar charts, and line graphs.

## Features

- User Authentication (Register, Login, Logout)
- Add, Edit, Delete Transactions
- Categorize Income and Expenses
- View Transaction History
- Dashboard with Statistics
- Visual Analytics:
  - Pie Chart: Expense breakdown by category
  - Bar Chart: Income vs Expenses by category
  - Line Chart: Monthly trends
- Filter transactions by type and category
- Responsive Design
- Beautiful UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- Vite
- Tailwind CSS
- Recharts for data visualization
- Axios for API calls
- Lucide React for icons
- date-fns for date formatting

## Project Structure

```
income-expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── transactionController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── transactionRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Charts.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Register.jsx
    │   │   ├── TransactionForm.jsx
    │   │   └── TransactionList.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend folder:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
```

**For MongoDB Atlas:**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

5. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend folder:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account or login if you already have one
3. Start adding your income and expense transactions
4. View your financial statistics on the dashboard
5. Analyze your spending patterns with the charts
6. Filter transactions by type or category
7. Edit or delete transactions as needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Transactions
- `GET /api/transactions` - Get all transactions (protected)
- `GET /api/transactions/:id` - Get single transaction (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)
- `GET /api/transactions/statistics` - Get statistics (protected)

## Building for Production

### Backend
The backend is ready for production. Just ensure you:
- Set `NODE_ENV=production` in your `.env`
- Use a strong `JWT_SECRET`
- Use a production MongoDB database

### Frontend

Build the frontend:
```bash
cd frontend
npm run build
```

The build files will be in the `dist` folder. You can serve them using any static file server or deploy to platforms like Vercel, Netlify, etc.

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Screenshots

The application includes:
- Modern authentication screens with gradient backgrounds
- Dashboard with colorful statistics cards
- Interactive charts (Pie, Bar, Line)
- Clean transaction list with edit/delete options
- Modal form for adding/editing transactions
- Responsive design for mobile and desktop

## Contributing

This is a mini project for educational purposes. Feel free to fork and modify as needed.

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check the MongoDB connection, ensure all dependencies are installed, and verify that both backend and frontend servers are running.

## Author

Created as a mini project demonstrating MERN stack development with modern UI/UX design principles.
