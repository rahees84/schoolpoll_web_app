# 🗳️ School Poll Frontend

This is the **React frontend** for the School Poll voting system. It provides a real-time voting interface for students and admins using REST APIs and WebSockets.

## 🚀 Features

- ✅ JWT-based user authentication  
- 🧑‍🎓 Voter management (add/edit voters)  
- 🗳️ Candidate list and double-click voting  
- 📡 Real-time voter authorization via Socket.IO  
- 🖥️ Voting machine interface (one vote per authorized voter)  
- 🎨 Clean UI using Bootstrap and Font Awesome  

## 🏗️ Project Structure

```
src/
├── components/            # Reusable components
├── pages/                 # Main page views (Voters, VotingMachine)
├── constants/             # API endpoints and constants
├── App.js                 # Application routes and layout
└── index.js               # App entry point
```

## ⚙️ Setup Instructions

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/school-poll-frontend.git
   cd school-poll-frontend
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Start the frontend**  
   ```bash
   npm start
   ```

4. **Make sure the backend is running on `http://localhost:5000`**  
   If it's hosted elsewhere, update the base URL in:

   `src/constants/appConstants.js`
   ```js
   const BASE_URL = 'http://localhost:5000';

   export const API = {
     CANDIDATES: `${BASE_URL}/api/candidate`,
     VOTERS: `${BASE_URL}/api/voter`,
     VOTE: `${BASE_URL}/api/vote`,
     // other endpoints...
   };
   ```

## 🧩 Built With

- React  
- Axios  
- Socket.IO Client  
- Bootstrap 5  
- Font Awesome  

## 📌 Notes

- Voter must be authorized by polling officer before voting.  
- Voting is confirmed via **double-click** to avoid accidental submissions.  
- JWT token is stored in `localStorage`.  

## 📄 License

This project is licensed under the [MIT License](LICENSE).