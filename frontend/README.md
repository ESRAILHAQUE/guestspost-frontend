# GuestPost Frontend

A modern, responsive web application for the GuestPost marketplace platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality

- **User Authentication** - Complete login/signup system with JWT tokens
- **Dashboard Management** - Comprehensive user dashboard with order tracking, fund management, and profile settings
- **Website Catalog** - Dynamic browsing and filtering of available websites for guest posting
- **Order Management** - Full order lifecycle from placement to completion
- **Fund Requests** - PayPal integration for account top-ups and balance management
- **Site Submissions** - Publisher website submission system with CSV bulk upload
- **Admin Panel** - Complete administrative interface for managing users, orders, and content

### Technical Features

- **Modern UI/UX** - Beautiful, responsive design with dark/light theme support
- **Real-time Updates** - Live order status updates and notifications
- **File Upload** - Support for CSV bulk uploads and document attachments
- **Search & Filtering** - Advanced filtering and search capabilities
- **Mobile Responsive** - Optimized for all device sizes
- **Type Safety** - Full TypeScript implementation with comprehensive type definitions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom Components
- **State Management**: React Query (TanStack Query)
- **Authentication**: JWT-based authentication
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Package Manager**: pnpm

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard pages
│   ├── admin/            # Admin panel pages
│   ├── auth/             # Authentication pages
│   └── ...               # Other pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks
│   └── api/              # API-related hooks
├── lib/                  # Utility libraries
│   └── api/              # API client configuration
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ESRAILHAQUE/guestspost-frontend.git
   cd guestspost-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

4. **Run development server**

   ```bash
   pnpm run dev
   ```

5. **Build for production**
   ```bash
   pnpm run build
   ```

## 🌐 Deployment

The application is deployed on **Netlify** at: https://guestspost.netlify.app/

### Deployment Configuration

- **Build Command**: `pnpm run build`
- **Publish Directory**: `out`
- **Node Version**: 18.x
- **Package Manager**: pnpm

## 🔗 API Integration

The frontend integrates with a Node.js backend API providing:

- User authentication and management
- Order processing and tracking
- Website catalog management
- Fund request processing
- Site submission handling
- Admin panel functionality

**Backend Repository**: https://github.com/ESRAILHAQUE/guestspost-backend

## 📱 Key Pages

### User Pages

- **Homepage** - Landing page with website catalog preview
- **Dashboard** - User account overview and management
- **Orders** - Order history and status tracking
- **Funds** - Balance management and top-up requests
- **Profile** - User profile and settings management
- **Catalog** - Browse available websites for guest posting

### Admin Pages

- **Admin Dashboard** - System overview and statistics
- **User Management** - User account administration
- **Order Management** - Order processing and completion
- **Website Management** - Website catalog administration
- **Fund Requests** - Fund request approval system
- **Site Submissions** - Publisher application review

### Authentication

- **Login** - User authentication
- **Signup** - New user registration
- **Password Reset** - Password recovery system

## 🎨 Design System

The application uses a modern design system with:

- **Color Palette**: Blue/Cyan gradient primary colors
- **Typography**: Inter font family
- **Components**: Consistent UI components with Radix UI
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 🔒 Security Features

- JWT token-based authentication
- Secure API communication
- Input validation and sanitization
- CORS protection
- Environment variable security

## 📊 Performance

- **Next.js Optimization**: Automatic code splitting and optimization
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Optimized bundle sizes
- **Caching**: React Query for efficient data caching
- **SEO**: Server-side rendering and meta tags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**
