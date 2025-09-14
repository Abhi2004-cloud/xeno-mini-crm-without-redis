# Xeno Mini CRM Platform

A comprehensive customer relationship management system built for the Xeno SDE Internship Assignment 2025. This platform enables customer segmentation, personalized campaign delivery, and intelligent insights using modern web technologies and AI integration.

## 🚀 Live Demo

**Deployed Application**: (https://xeno-mini-crm-without-redis.vercel.app/)

## ✨ Features

- **Customer Management**: Import and manage customer data with detailed profiles
- **Smart Campaign Creation**: Advanced audience segmentation with AND/OR logic
- **AI-Powered Messages**: Generate personalized campaign messages using OpenAI
- **Real-time Analytics**: Track campaign delivery status and performance
- **Google OAuth Authentication**: Secure login system
- **Responsive UI**: Professional interface built with Bootstrap

## 🏗️ Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend APIs   │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js API)  │◄──►│   (MongoDB)     │
│                 │    │                  │    │                 │
│ • React Pages   │    │ • Authentication │    │ • Customer      │
│ • Campaign UI   │    │ • Campaign CRUD  │    │ • Campaign      │
│ • Real-time     │    │ • Message Proc.  │    │ • Comm. Logs    │
│   Updates       │    │ • AI Integration │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   External APIs  │
                       │                  │
                       │ • OpenAI API     │
                       │ • Google OAuth   │
                       └──────────────────┘
```

### Data Flow:
1. **Authentication**: Users sign in via Google OAuth
2. **Data Ingestion**: Customer data stored in MongoDB via REST APIs
3. **Campaign Creation**: Dynamic rule builder creates MongoDB queries
4. **Message Processing**: Campaigns generate personalized messages
5. **AI Integration**: OpenAI generates message suggestions
6. **Real-time Updates**: Frontend polls for delivery status updates

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database (local or Atlas)
- Google OAuth credentials
- OpenAI API key

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your-mongodb-connection-string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# AI Integration
OPENAI_API_KEY=your-openai-api-key
```

**Note**: Never commit the `.env.local` file to version control. All values should be obtained from their respective service providers.

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Abhi2004-cloud/xeno-mini-crm-without-redis]
   cd xeno-mini-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

4. **Set up OpenAI API**
   - Get API key from [OpenAI Platform](https://platform.openai.com/)
   - Add to environment variables

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Sign in with Google to access features

## 🤖 AI Tools and Technology Stack

### Frontend
- **Next.js 15.5.2**: React framework with App Router
- **React 19.1.0**: UI library
- **Bootstrap 5.3.8**: CSS framework for responsive design
- **Bootstrap Icons**: Icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **NextAuth.js 4.24.11**: Authentication with Google OAuth
- **Mongoose 8.18.0**: MongoDB object modeling

### Database
- **MongoDB**: Document database for flexible data storage
- **Collections**: Customer, Campaign, CommunicationLog

### AI Integration
- **OpenAI API**: GPT model for message generation
- **Use Case**: Campaign message suggestions based on objectives
- **Implementation**: RESTful API calls with prompt engineering

### Deployment
- **Vercel**: Serverless deployment platform
- **Environment**: Production-optimized with edge functions

### Development Tools
- **ESLint**: Code linting and quality
- **Turbopack**: Fast bundler for development

## ⚠️ Known Limitations and Assumptions

### Technical Limitations
1. **Serverless Constraints**: 
   - No persistent background jobs
   - Function timeout limits (10 seconds on Vercel)
   - Cold start delays for infrequent requests

2. **Database Scaling**:
   - No database connection pooling implemented
   - Single MongoDB instance (not sharded)
   - No caching layer for frequently accessed data

3. **Message Processing**:
   - Synchronous processing only (no queue system)
   - Limited to processing campaigns within request timeout
   - No retry mechanism for failed message deliveries

### Business Assumptions
1. **Customer Data**:
   - Customers belong to individual users (multi-tenancy by email)
   - Customer emails are unique per user
   - Spend amounts are in a single currency

2. **Campaign Logic**:
   - "Inactive days" calculated from `lastActiveAt` field
   - Message personalization limited to customer name
   - 90% success rate simulation for vendor API

3. **Authentication**:
   - Google OAuth is the only authentication method
   - Users are identified by email address
   - No role-based access control

### Scalability Considerations
1. **Performance**:
   - Frontend polling every 3 seconds (could be optimized with WebSockets)
   - No pagination for large customer lists
   - AI API calls are synchronous (could timeout with large requests)

2. **Data Volume**:
   - Designed for small to medium datasets (< 10,000 customers)
   - No bulk import functionality
   - Campaign history grows indefinitely

### Security Assumptions
1. **Data Protection**:
   - Relies on MongoDB Atlas security features
   - No data encryption at application level
   - API keys stored in environment variables

2. **Input Validation**:
   - Basic validation implemented
   - No advanced sanitization for AI prompts
   - Assumes trusted user input for campaign rules

## 🚀 Future Enhancements

- WebSocket integration for real-time updates
- Bulk customer import via CSV
- Advanced analytics and reporting
- Email template designer
- Campaign scheduling
- A/B testing capabilities
- Database optimization and caching

## 📝 Assignment Compliance

This project fulfills all core requirements of the Xeno SDE Internship Assignment:
- ✅ Data Ingestion APIs with authentication
- ✅ Campaign Creation UI with flexible rule logic
- ✅ Campaign Delivery & Logging with status tracking
- ✅ Google OAuth 2.0 Authentication
- ✅ AI Integration for message suggestions

Built with ❤️ for the Xeno SDE Internship Assignment 2025
