===========================================
MEDICONNECT BACKEND SETUP — FULL GUIDE
===========================================

DATABASE IS ALREADY CREATED (mediconnect in pgAdmin) ✅
VIRTUAL ENV ALREADY ACTIVATED ✅

---------------------------------------------
STEP 1 — Edit the .env file
---------------------------------------------
Open backend/.env and replace YOUR_POSTGRES_PASSWORD
with the password you set when installing PostgreSQL.

Example:
DATABASE_URL=postgresql://postgres:admin123@localhost/mediconnect

---------------------------------------------
STEP 2 — Open terminal in VS Code
Press Ctrl + ` and run:
---------------------------------------------

cd "C:\Users\Marhaba Tech\Desktop\mediconnect\backend"

venv\Scripts\activate

pip install -r requirements.txt

---------------------------------------------
STEP 3 — Run the backend
---------------------------------------------

uvicorn app.main:app --reload

You should see:
  INFO: Uvicorn running on http://127.0.0.1:8000

Open browser: http://localhost:8000
You should see: {"message":"MediConnect API is running"}

API docs: http://localhost:8000/docs

---------------------------------------------
STEP 4 — Update Frontend AuthContext
---------------------------------------------
Copy frontend_src/context/AuthContext.tsx
to your project: src/context/AuthContext.tsx
(replaces the old mock one)

---------------------------------------------
STEP 5 — Test in browser
---------------------------------------------
1. Run backend: uvicorn app.main:app --reload
2. Run frontend: npm start (in a SEPARATE terminal)
3. Go to localhost:3000
4. Register a new account
5. Login with that account
6. It should work with REAL database now!

---------------------------------------------
SECURITY FEATURES IN BACKEND:
---------------------------------------------
✅ Password hashing with bcrypt
✅ JWT access tokens (30 min expiry)
✅ HttpOnly refresh token cookie (7 days)
✅ Email format validation
✅ Password min 6 characters
✅ Duplicate email check
✅ CORS configured for localhost:3000
✅ Input sanitization
