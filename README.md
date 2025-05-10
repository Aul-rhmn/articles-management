
# Article Management System

A modern platform for managing articles with different user roles and permissions.
This system allows users to browse articles by category, search with debounce functionality, and view article details.
Administrators can manage articles and categories, publish drafts, and maintain the content.

**Live Demo**: [https://articles-management-zeta.vercel.app/](https://articles-management-zeta.vercel.app/)

## Login Credentials

### Admin

* **Email**: `admin@example.com`
* **Password**: `password`

### User

* **Email**: `user@example.com`
* **Password**: `password`

## Features

### User Features

* Login, register, and logout with form validation
* Redirect to article list after login/register
* Browse articles by category
* Search articles with debounce (300–500ms)
* Pagination for more than 9 articles
* View full article details
* See up to 3 related articles from the same category

### Admin Features

* Login, register, and logout with form validation
* Redirect to admin article list after login/register
* List, create, edit, and delete categories with pagination (more than 10 items)
* Search categories with debounce
* List, create, edit, and delete articles with form validation
* Filter articles by category
* Search articles with debounce
* Pagination for more than 10 articles
* Preview articles before submitting

## Technology Stack

* **Framework**: Next.js 14 (App Router, SSR, CSR)
* **Styling**: Tailwind CSS, shadcn/ui
* **Form Validation**: React Hook Form + Zod
* **Icons**: Lucide
* **Data Fetching**: Axios with custom API layer and fallback to mock data
* **Version Control**: Git & GitHub (Git flow)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Aul-rhmn/article-management.git
   cd article-management
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   If it fails, run:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

* Base URL: `https://test-fe.mysellerpintar.com/api`
* The app will fallback to dummy/mock data if API is down.
* Logic is added to simulate unavailable or missing features in the API.

### API Endpoints Used

* Articles: `GET`, `POST`, `PUT`, `DELETE`, `GET /:id`
* Categories: `GET`, `POST`, `PUT`, `DELETE`, `GET /:id`

## Responsive Design

Works seamlessly on mobile, tablet, and desktop. UI slicing based on responsive design specs.

## Extra Features

* Loading, success, and error state handling
* Backup dummy data for presentation or interview
* Clean and modular code structure following best practices

## Future Improvements

* NextAuth.js integration
* Database connection
* Rich text editor
* Image upload
* Real-time search
* Autosave for drafts
* Version history for articles

## Contribution Guide

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to your fork
5. Submit a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

* [Next.js](https://nextjs.org/)
* [React](https://reactjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Lucide Icons](https://lucide.dev/)

