# Article Management System

A modern platform for managing articles with different user roles and permissions. This system allows users to browse articles by category, search with debounce functionality, and view article details. Administrators can manage articles and categories, publish drafts, and maintain the content.

![Article Management System](https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png)

## Features

### User Features
- Browse articles by category
- Search articles with debounce functionality
- View article details
- See related articles
- Filter articles by category

### Admin Features
- Create, edit, and delete articles
- Manage categories
- Publish or save articles as drafts
- Preview articles before publishing
- Filter articles by status and category

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Form Handling**: React Hook Form, Zod
- **API Integration**: Custom fetch API with fallback to mock data

## Project Structure

\`\`\`
article-management-system/
├── app/                      # Next.js app directory
│   ├── admin/                # Admin routes
│   │   ├── articles/         # Article management
│   │   ├── categories/       # Category management
│   │   └── dashboard/        # Admin dashboard
│   ├── article/              # Article detail pages
│   ├── dashboard/            # User dashboard
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── globals.css           # Global styles
│   └── layout.tsx            # Root layout
├── components/               # Reusable components
│   ├── ui/                   # UI components
│   └── theme-provider.tsx    # Theme provider
├── hooks/                    # Custom hooks
│   └── use-debounce.ts       # Debounce hook
├── lib/                      # Utility functions
│   ├── api.ts                # API service
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
└── README.md                 # Project documentation
\`\`\`

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/article-management-system.git
cd article-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### User Access

1. Navigate to the homepage
2. Click "Login as User" or register a new account
3. Browse articles on the dashboard
4. Use the search bar to find specific articles
5. Filter articles by category using the dropdown
6. Click on an article to view its details

### Admin Access

1. Navigate to the homepage
2. Click "Login as Admin"
3. Access the admin dashboard to manage articles and categories
4. Create new articles by clicking "New Article"
5. Edit or delete existing articles
6. Publish drafts or save new drafts
7. Manage categories

## API Integration

The application is designed to work with a REST API at `https://test-fe.mysellerpintar.com/api`. The API integration includes:

- Automatic fallback to mock data if the API is unavailable
- Error handling for API requests
- Support for all CRUD operations

### API Endpoints

- `GET /articles` - Get all articles
- `GET /articles/:id` - Get article by ID
- `POST /articles` - Create a new article
- `PUT /articles/:id` - Update an article
- `DELETE /articles/:id` - Delete an article
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

## Authentication

The application includes a simulated authentication system. In a production environment, this would be replaced with a real authentication system like NextAuth.js or a custom JWT implementation.

## Responsive Design

The application is fully responsive and works on mobile, tablet, and desktop devices.

## Future Enhancements

- Add authentication with NextAuth.js
- Add database integration
- Implement rich text editor
- Add image upload functionality
- Implement real-time search
- Add article categories management
- Implement draft autosave
- Add article versioning

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
