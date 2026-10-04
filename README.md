# Store-Rating-System
Store Rating System is a full-stack web application that enables users to browse stores, submit and update ratings, and manage their profiles. Admins can manage users and stores with search, filtering and pagination, while store owners can view ratings and average performance through their dashboard.

## Features

### Admin

* Dashboard with users, stores, and ratings statistics
* Add and manage users and stores
* Search, filter, sorting, and pagination
* View user details and store ratings
* Role-based access control

### Normal User

* User registration and login
* Browse and search stores
* View overall store ratings
* Submit and update ratings from 1 to 5
* View personal ratings
* Change password

### Store Owner

* Store owner dashboard
* View owned stores
* View customer ratings
* View average store rating
* Change password

## Tech Stack

**Frontend**

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React

**Backend**

* Node.js
* Express.js
* MySQL
* JWT Authentication
* bcryptjs

## Project Structure

```text
Store Rating System/
├── frontend/
└── backend/
```

## Validation & Security

* JWT-based authentication
* Role-based authorization
* Password hashing using bcrypt
* Input validation
* Protected routes
* API rate limiting

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/shivamp7428/Store-Rating-System.git
cd Store-Rating-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_system
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run using the Vite development server.

## User Roles

| Role        | Access                                      |
| ----------- | ------------------------------------------- |
| Admin       | Manage users, stores, ratings and dashboard |
| User        | Browse stores and submit/update ratings     |
| Store Owner | View store ratings and average rating       |

