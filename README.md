# PracticeCF

A production-oriented full-stack application that helps competitive programmers retain problem-solving techniques through spaced repetition.

PracticeCF automatically synchronizes solved Codeforces problems, organizes them into structured revision windows (1-day, 7-day, and 30-day), and provides a dashboard for long-term practice. The project focuses not only on solving the user problem but also on demonstrating modern backend engineering practices such as authentication, API design, caching, asynchronous processing, and service reliability.

## Table of Contents

* [Why PracticeCF?](#why-practicecf)
* [Features](#features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)

  * [Frontend](#frontend)
  * [Backend](#backend)
  * [Authentication](#authentication)
  * [Infrastructure](#infrastructure)
* [Engineering Highlights](#engineering-highlights)

  * [Authentication](#authentication-1)
  * [API Layer](#api-layer)
  * [Background Processing](#background-processing)
  * [Caching](#caching)
  * [Reliability](#reliability)
  * [Database Design](#database-design)
* [Running Locally](#running-locally)
* [Future Improvements](#future-improvements)
* [Lessons Learned](#lessons-learned)
* [License](#license)
* [Acknowlegements](#acknowledgments)

## Why PracticeCF?

Competitive programmers often solve hundreds of problems but rarely revisit them, causing algorithms and techniques to be forgotten over time.

PracticeCF automates this process by continuously syncing submissions from Codeforces and scheduling problems for revision using spaced repetition.


# Features

* Google OAuth authentication
* Automatic synchronization of Codeforces submissions
* Spaced repetition revision scheduler
* Revision dashboard with 1-day, 7-day, and 30-day review queues
* Persistent PostgreSQL storage with Prisma ORM
* RESTful API architecture
* Redis caching for frequently accessed Codeforces data
* Background job processing for asynchronous synchronization
* Rate limiting to protect public APIs
* Centralized error handling and request validation
* Structured logging for easier debugging

# Architecture

```
                +----------------------+
                |      React SPA       |
                +----------+-----------+
                           |
                           |
                   API Gateway / BFF
                           |
      +--------------------+-------------------+
      |                    |                   |
 Authentication      Revision Service     Sync Service
      |                    |                   |
      |                    |           BullMQ Worker
      |                    |                   |
      +--------------------+-------------------+
                           |
                    PostgreSQL (Prisma)
                           |
                        Redis Cache
                           |
                    Codeforces API
```


# Tech Stack

### Frontend

* React
* Tailwind CSS

### Backend

* Node.js
* Express
* Prisma ORM
* PostgreSQL
* Redis
* BullMQ

### Authentication

* Google OAuth

### Infrastructure

* GitHub Actions


# Engineering Highlights

### Authentication

Implemented secure Google OAuth login with authenticated sessions and protected API routes.

### API Layer

Designed modular REST APIs with separation between authentication, synchronization, and revision services.

### Background Processing

Submission synchronization runs asynchronously through background workers, preventing long-running external API calls from blocking user requests.

### Caching

Redis is used to cache frequently requested Codeforces responses, reducing redundant API calls and improving response times.

### Reliability

Implemented rate limiting, centralized error handling, request validation, and structured logging to improve robustness and simplify debugging.

### Database Design

Modeled users, submissions, and revision schedules using Prisma ORM with PostgreSQL.


# Future Improvements

* WebSocket notifications for completed synchronization
* Revision streaks and analytics
* Personalized notes per problem
* Problem tagging and filtering
* Email reminders
* OpenAPI/Swagger documentation
* Kubernetes deployment
* Prometheus and Grafana monitoring


# Running Locally

```bash
git clone https://github.com/Harsh-2005d/practiceCF

cd practiceCF

```

Create a `.env` file with the required database, OAuth, Redis, and session configuration before starting the application.


# Lessons Learned

This project evolved from a simple revision tracker into a backend-focused application exploring authentication, asynchronous processing, caching, API design, and building reliable services that interact with third-party APIs.



## License

Distributed under the **project_license**. See `LICENSE.txt` for more information.


## Contact

Harsh Dahiya
- Email: [dahiyaharsh2005@gmail.com](mailto:dahiyaharsh2005@gmail.com)


## Acknowledgments

* Codeforces for the API
