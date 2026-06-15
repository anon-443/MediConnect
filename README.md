# MediConnect
A full-stack medical portal with 108+ diseases, hospital finder (OpenStreetMap), doctor appointments, JWT auth, and real-time chat (WebSocket). Built with React + FastAPI + PostgreSQL.

## Project Overview

MediConnect is a full-stack web application that enables patients to browse 108+ diseases across 15 categories, find hospitals on an interactive OpenStreetMap, consult doctors, book appointments, and chat with healthcare providers, all protected by a complete JWT-based authentication system.

## Features

### Authentication & Security
- JWT authentication with refresh tokens (HttpOnly cookies)
- Password reset flow via Gmail SMTP
- Brute force protection (5 failed attempts = 15 min lockout)
- bcrypt password hashing
- SQL injection and XSS prevention
- Role-based access (Admin, Doctor, Patient)

### Core Features
- Disease Directory - 108 diseases across 15 categories (WHO-sourced data)
- Hospital Finder - Interactive Leaflet/OpenStreetMap with 24 hospitals across Pakistan
- Doctor Listing - Specialties, fees, availability status
- Appointment Booking - Create and cancel with status tracking
- Real-time Chat - WebSocket-based messaging
- Profile Management - User information and logout

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | FastAPI (Python) |
| Database | PostgreSQL + SQLAlchemy ORM |
| Authentication | JWT + bcrypt + HttpOnly cookies |
| Mapping | Leaflet / OpenStreetMap |
| Real-time | WebSockets |
| Container | Docker + Docker Compose |

## System Architecture

Frontend (React :3000) <-> Backend (FastAPI :8000) <-> Database (PostgreSQL :5432)

## Quick Start

### Run with Docker

```bash
git clone https://github.com/YOUR_USERNAME/MediConnect.git
cd MediConnect
docker-compose up
