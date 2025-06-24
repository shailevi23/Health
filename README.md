# Health Blog

A modern health and wellness blog built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🎨 Modern, responsive design with glass morphism effects
- 📱 Mobile-first approach
- 🚀 Server-side rendering with Next.js
- 💅 Styled with Tailwind CSS
- 🗃️ Supabase backend for data storage
- 📧 Newsletter subscription system
- 🔍 SEO optimized
- 📝 Blog and recipe content management
- 🎯 Featured content sections

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Supabase account and project

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd health-blog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   npm run setup:env
   ```

   Follow the prompts to enter your Supabase configuration.

4. Run database migrations:

   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
health-blog/
├── public/          # Static assets
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # React components
│   ├── lib/         # Utility functions
│   └── types/       # TypeScript type definitions
├── scripts/         # Setup and maintenance scripts
└── supabase/       # Database migrations and schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run setup:env` - Set up environment variables
- `npm run db:migrate` - Run database migrations
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
