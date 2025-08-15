# Workout Tracker

**Workout Tracker** is a simple full-stack web application that allows users to log, monitor, and analyze their workouts.  

## 🎯 Features

### 1. **Authentication & Registration**
- Secure user sign-up and login using **JWT tokens** with **Refresh Token** strategy for extended session management.
- API protection with **Spring Security** and password hashing.

### 2. **Workout Logging**
- Record detailed workout information:
  - Exercise type *(Cardio, Strength, Flexibility, Sports, Other)*.
  - Duration.
  - Calories burned.
  - Workout intensity *(1–10 scale)* — objective measure of how hard the workout was.
  - Fatigue *(1–10 scale)* — subjective feeling after the workout.
  - Additional notes.
- Select date and time for each workout.
- Delete existing workouts.

### 3. **Progress Tracking**
- Select a month to view:
  - Total workout duration per week.
  - Number of workouts per week.
  - Average workout intensity and fatigue per week.
- Clear and responsive statistics display.

### 4. **Other Capabilities**
- Exercise type categorization with input validation.
- Pagination for workout history.
- Automatic generation of realistic test data for easier testing.
- Fully responsive UI optimized for desktop and mobile.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 17+ (TypeScript) + Angular Material |
| **Backend** | Spring Boot 3.x (Java 21) |
| **Database** | PostgreSQL 16 |
| **Authentication** | JWT with Refresh Tokens |
| **Security** | Spring Security + BCrypt |
| **Deployment** | Docker & Docker Compose |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Docker**
- **Git**

### 2. Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/conamiflo/workout-tracker.git
   cd workout-tracker
   ```

2. **Create `.env` file from the example**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your own configuration**

   Below is an example `.env` file and what each variable means:

   ```env
   DB_HOST=db                
   DB_PORT=5432              
   DB_NAME=workouttracker    
   DB_USER=workout           
   DB_PASSWORD=your_secure_password  

   SERVER_PORT=8080          
   APP_JWT_SECRET=your_jwt_secret_key        # Secret key for signing JWT tokens
   APP_JWT_EXPIRATION=900000                 # JWT token expiration in milliseconds (15 min)
   APP_JWT_REFRESH_EXPIRATION=604800000      # Refresh token expiration in milliseconds (7 days)

   APP_SEED_ENABLED=true      # Whether to pre-load test data (true/false)
   APP_SEED_USERS=5           # Number of test users to create if seeding is enabled
   APP_SEED_WORKOUTS=150      # Number of test workouts to create if seeding is enabled
   ```

   > **Notes:**  
    > - If seeding is enabled, test users will be created automatically:  
    >   - `username`: `user1`  
    >   - `username`: `user2`  
    >   - ... up to the number defined in `APP_SEED_USERS`.  
    > - All generated test users will have the same password:  
    >   - `password`: `password`  

4. **Build and run the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - **Frontend**: [http://localhost:4200](http://localhost:4200)  
   - **Backend API**: [http://localhost:8080](http://localhost:8080)

---

## 📦 Application Management

**Stop the application:**
```bash
docker-compose down
```

**Full reset (including database):**
```bash
docker-compose down -v
```
