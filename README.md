# Trax - Price Tracking Application

## Overview

**Trax** (also branded as **PriceTracker**) is a comprehensive price monitoring and alerting platform that helps users track prices for products across multiple e-commerce platforms. The application monitors prices for mobiles and flights, sending notifications when prices drop to user-defined target prices.

## Key Features

- **Multi-Platform Price Tracking**: Monitors prices across Amazon India and Flipkart
- **Product Categories**: Currently supports tracking for:
  - Mobile phones (with specifications like RAM, ROM, brand, model)
  - Flight prices
- **Smart Price Alerts**: Automated notifications when prices drop within ₹2000 of target price
- **User Dashboard**: Intuitive interface to manage trackers, view alerts, and monitor price history
- **Real-time Monitoring**: Background worker continuously checks prices at scheduled intervals

## Architecture

### Tech Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom theme support

#### Backend
- **Framework**: Motia (event-driven backend framework)
- **Language**: TypeScript
- **API**: RESTful endpoints with Motia Steps
- **Authentication**: JWT-based authentication with bcrypt
- **Job Queue**: BullMQ with Redis
- **Database**: MongoDB with Mongoose ODM

#### Worker Service
- **Purpose**: Background job processor for price checking
- **Queue System**: Redis FIFO queue
- **AI Integration**: Google GenAI (Gemini 2.5 Flash) for intelligent price fetching
- **Web Scraping**: Firecrawl integration (configured but using AI as primary method)
- **Processing**: Synchronous, sequential processing to ensure data consistency

### System Components

1. **Frontend Application** (`frontend/`)
   - User authentication and authorization
   - Dashboard for managing trackers
   - Mobile and flight tracking interfaces
   - Alert/notification center
   - Admin panel

2. **Backend API** (`trax-backend/`)
   - User management and authentication
   - Trigger/tracker CRUD operations
   - Event-driven workflows using Motia Steps
   - API endpoints for frontend integration
   - Queue management for price checking jobs

3. **Worker Service** (`worker/`)
   - Processes price checking jobs from Redis queue
   - Fetches prices using AI-powered search
   - Compares prices against target prices
   - Creates notifications when price conditions are met
   - Updates tracker records with latest prices

## Data Models

### User
- User authentication and profile information
- Associated with multiple trackers/triggers

### Trigger
- Defines what to track (mobile or flight)
- Contains configuration (product specs, target price, time duration)
- Tracks status (active/inactive, tracked/untracked)
- Stores last fetched price and next check time

### Tracker
- Historical price tracking data
- Current prices across different platforms
- Associated with triggers and users

### Notification
- Price alert notifications
- Links to triggers and users
- Read/unread status tracking

## Workflow

1. **User Creates Tracker**
   - User specifies product details (brand, model, RAM, ROM for mobiles)
   - Sets target price and tracking duration
   - Frontend sends request to backend API

2. **Backend Creates Trigger**
   - Backend creates a trigger record in MongoDB
   - Adds job to Redis queue for initial price check
   - Returns trigger ID to frontend

3. **Worker Processes Job**
   - Worker picks up job from Redis FIFO queue
   - Uses Google GenAI to search for product prices
   - Compares fetched prices with target price
   - Creates notification if price is within ₹2000 of target
   - Updates trigger with latest price and schedules next check

4. **User Receives Alerts**
   - Notifications appear in user's alert center
   - User can view price history and manage trackers

## Key Technologies

- **Google GenAI (Gemini)**: AI-powered price search and extraction
- **Firecrawl**: Web scraping capabilities (configured for future use)
- **Redis**: Job queue and caching
- **MongoDB**: Primary data storage
- **BullMQ**: Job queue management
- **Motia**: Unified backend framework for APIs, events, and workflows

## Deployment

- **Platform**: Railway
- **Configuration**: Docker-based deployment
- **Environment**: Production-ready with environment variable management

## Development

### Prerequisites
- Node.js
- MongoDB instance
- Redis instance
- Google GenAI API key

### Running Locally

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd trax-backend
npm install
npm run dev
```

**Worker:**
```bash
cd worker
npm install
npm run dev
```

## Project Structure

```
trax/
├── frontend/          # React frontend application
├── trax-backend/      # Motia backend API
├── worker/            # Background job processor
└── railway.json       # Railway deployment configuration
```

## Future Enhancements

- Support for additional product categories (clothing, electronics, etc.)
- More e-commerce platforms (eBay, Myntra, etc.)
- Price history charts and analytics
- Email/SMS notifications
- Browser extension for quick product tracking
- Price prediction using historical data


