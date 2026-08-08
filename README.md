# Time Slot Booking System

A full-stack MERN application for managing time-slot appointments. The project allows users to create, view, update, and delete bookings while preventing duplicate reservations for the same slot.

This project demonstrates a practical CRUD workflow, frontend-backend integration, API development, and MongoDB connectivity in a real-world booking use case.

---

## Live Demo

- Frontend: https://time-slot-booking-app-tau.vercel.app
- Backend API: https://time-slot-booking-api.onrender.com

---

## Project Overview

The application is designed for appointment-based booking scenarios where users need to reserve available time slots without conflicts. It provides a clean interface for managing bookings and displays only valid available time slots to the end user.

---

## Key Features

- Create new bookings
- View all booked slots
- Update existing bookings
- Delete bookings
- Prevent duplicate booking of the same time slot
- Disable already reserved slots automatically
- Responsive and simple UI for smooth interaction
- Error handling for invalid requests and duplicate bookings

---

## Tech Stack

### Frontend

- React
- Vite
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Deployment

- Vercel for frontend
- Render for backend

---

## Project Structure

```text
time-slot-booking-app
├── client/
│   ├── public/
│   ├── src/
│   └── package.json
├── Server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
└── README.md
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Thilaksan8/time-slot-booking-app.git
cd time-slot-booking-app
```

### 2. Backend Setup

```bash
cd Server
npm install
```

Create a `.env` file in the `Server` folder using the example format below:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run the backend:

```bash
npm start
```

Or for development:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| GET    | `/booking`     | Retrieve all bookings      |
| POST   | `/booking`     | Create a new booking       |
| PUT    | `/booking/:id` | Update an existing booking |
| DELETE | `/booking/:id` | Delete a booking           |

---

## Validation Rules

The system ensures that:

- duplicate time slots cannot be booked
- empty or invalid booking data is rejected
- the user receives feedback for successful or failed operations

---

## Future Enhancements

- User authentication and role-based access
- Admin dashboard
- Search and filtering
- Email notifications
- Dark mode
- Calendar integration
- Responsive mobile improvements

---

## Author

Thilaksan Elango

Computer Science & Engineering Undergraduate  
University of Moratuwa

GitHub: https://github.com/Thilaksan8

---

## License

This project was developed for learning and technical assignment purposes.
