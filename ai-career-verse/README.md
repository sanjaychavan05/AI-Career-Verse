# AI Career Verse

A full-stack AI-powered career guidance platform.

## Project Structure

```
ai-career-verse/
├── .env                    # Environment variables
├── backend/                # Spring Boot API
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/aicareerverse/
│       │   │   ├── AiCareerVerseApplication.java
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java
│       │   │   │   └── GeminiConfig.java
│       │   │   └── controller/
│       │   │       └── HealthController.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/
└── frontend/               # React + Vite
```

## Getting Started

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

- API: http://localhost:8080/api/health
- H2 Console: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:ai_career_verse_db`
  - Username: `sa`
  - Password: _(leave empty)_

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173

## Environment Variables

| Variable       | Value                                      |
|---------------|--------------------------------------------|
| GEMINI_API_KEY | Your Gemini API key                        |
| DB_TYPE        | H2                                         |
