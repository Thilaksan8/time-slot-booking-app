# 📅 Time Slot Booking System

A full-stack MERN application that allows users to book, update, and manage appointment time slots while preventing duplicate bookings. The application demonstrates complete CRUD operations, REST API development, MongoDB integration, and frontend-backend communication.

---

## 🌐 Live Demo

**Frontend (Vercel):**
> https://time-slot-booking-app-tau.vercel.app

**Backend API (Render):**
> https://time-slot-booking-api.onrender.com

---

## 📌 Features

- ✅ Create a new booking
- ✅ View all booked appointments
- ✅ Update existing bookings
- ✅ Delete bookings
- ✅ Prevent duplicate time-slot reservations
- ✅ Automatically disable booked time slots
- ✅ Display booking success and error messages
- ✅ Responsive and clean user interface

---

## 🛠 Tech Stack

### Frontend
- React
- Vite
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```
time-slot-booking-app
│
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── Server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/Thilaksan8/time-slot-booking-app.git

cd time-slot-booking-app
```

---

### Backend Setup

```bash
cd Server

npm install
```

Create a `.env` file inside the `Server` folder.

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run the backend:

```bash
npm start
```

or

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

## 📷 Application Preview

> Add screenshots here after deployment.

Example:

- Home Page
- Booking Form
- Booked Slots
- Edit Booking
- Delete Booking

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/booking` | Retrieve all bookings |
| POST | `/booking` | Create a booking |
| PUT | `/booking/:id` | Update a booking |
| DELETE | `/booking/:id` | Delete a booking |

---

## 🔒 Validation

The application prevents:

- Booking an already reserved time slot
- Empty booking information
- Invalid CRUD requests

---

## 🔮 Future Improvements

- 🌙 Dark / Light Mode
- 🔐 User Authentication
- 👤 User Accounts
- 📧 Email Notifications
- 📅 Calendar Integration
- 🔍 Search and Filtering
- 📊 Admin Dashboard
- 📱 Improved Mobile Responsiveness

---

## 👨‍💻 Author

**Thilaksan Elango**

Computer Science & Engineering Undergraduate  
University of Moratuwa

GitHub:
https://github.com/Thilaksan8

---

## 📄 License

This project was developed for learning purposes and as part of the Rotaract Mora IT Team technical assignment.