# 🧠 Task Manager Backend API  
A Node.js + Express + MongoDB backend for a Task Management application.  
Provides secure user authentication, task CRUD operations, and role-based access.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **CORS Enabled**
- **Deployed on Render**

---

## 📁 Folder Structure
/src

├── controllers/ # Business logic

├── models/ # Mongoose schemas

├── routes/ # API routes

├── middleware/ # Auth middleware

├── config/ #third party config 

├── index.js # App entry point

/test

├──user # test for all authentication route

├──task#test for all task routes

├──setup# setup for test

.env

package.json


---

## 🔧 Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
 ```
▶️ Running Locally

Clone the repository:

```terminal
git clone https://github.com/farazghani/taskmanager
cd taskmanager
 ```


Install dependencies:

```terminal
npm install
 ```
npm install


Start development server:

```terminal
npm run dev
 ```


Start production server:

```terminal
npm start
 ```
