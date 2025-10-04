# 🤖 AI Agent Guide for Dinder

This document provides essential information for AI agents working on the Dinder meal planning application.

## 📋 Project Overview

**Dinder** is a Tinder-style meal planning app built with Astro, React, and CSS. Users swipe through meal options to plan their weekly menu. The app uses Astro content collections to manage meal data stored as markdown files.

## 🏗️ Architecture

### Tech Stack
- **Astro 5.14.1** - Static site generator with React integration
- **React 19.2.0** - Interactive components
- **react-tinder-card 1.6.4** - Swipe functionality
- **@react-spring/web 10.0.3** - Animation library (dependency of react-tinder-card)
- **TypeScript** - Type safety
- **Custom CSS** - Styling (no Tailwind CSS)

### Key Dependencies
```json
{
  "astro": "^5.14.1",
  "@astrojs/react": "4.4.0",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-tinder-card": "1.6.4",
  "@react-spring/web": "10.0.3"
}
```

## 📁 Project Structure

```
dinder-astro/
├── src/
│   ├── components/
│   │   └── MealTinder.tsx          # Main swiping component
│   ├── content/
│   │   ├── config.ts               # Content collection schema
│   │   └── meals/                  # Meal markdown files
│   │       ├── spaghetti-carbonara.md
│   │       ├── chicken-teriyaki.md
│   │       ├── vegetarian-buddha-bowl.md
│   │       ├── beef-tacos.md
│   │       └── salmon-teriyaki.md
│   ├── pages/
│   │   └── index.astro             # Main page
│   └── styles/
│       └── global.css             # Custom CSS styles
├── astro.config.mjs               # Astro configuration
├── package.json
└── README.md
```

## 🔧 Configuration Files

### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()]
});
```

### src/content/config.ts
Defines the schema for meal content collection:
```typescript
const meals = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    image: z.string(),
    url: z.string().optional(),
  }),
});
```

## 🎯 Core Components

### MealTinder.tsx
The main React component that handles:
- Tinder-style card swiping
- State management for liked/disliked meals
- Action buttons (like, dislike, undo)
- Results display
- Responsive design

**Key Props:**
- `meals: Meal[]` - Array of meal objects with `name`, `image`, and optional `url`

**Key State:**
- `currentIndex` - Current card being displayed
- `likedMeals` - Array of liked meals
- `dislikedMeals` - Array of disliked meals
- `lastDirection` - Last swipe direction

## 📝 Content Management

### Meal Markdown Structure
Each meal is stored as a markdown file in `src/content/meals/` with frontmatter:

```yaml
---
name: "Meal Name"
image: "https://images.unsplash.com/photo-1234567890?w=500&h=400&fit=crop"
url: "https://example.com/recipe" # Optional - link to recipe
---
```

### Adding New Meals
1. Create a new `.md` file in `src/content/meals/`
2. Follow the frontmatter schema exactly (name, image, optional url)
3. The meal will automatically appear in the app

## 🎨 Styling System

### CSS Architecture
- **File**: `src/styles/global.css`
- **Approach**: Custom CSS with CSS Grid and Flexbox
- **No Framework**: Tailwind CSS was removed due to compatibility issues
- **Responsive**: Mobile-first design with media queries

### Key CSS Classes
- `.tinder-container` - Main container
- `.tinder-card` - Individual meal cards
- `.action-btn` - Swipe action buttons
- `.difficulty-badge` - Difficulty level indicators
- `.card-stats` - Meal statistics grid
- `.nutrition-grid` - Nutrition information grid

## 🚀 Development Workflow

### Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server (localhost:4321)
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Development Server
- Runs on `http://localhost:4321`
- Hot reload enabled
- Content collections auto-sync

## 🐛 Known Issues & Solutions

### Dependency Warnings
- `react-tinder-card` expects React 16-18, but we use React 19
- `@react-spring/web` version mismatch
- **Solution**: These warnings don't affect functionality

### Build Process
- Ensure all meal frontmatter fields match the schema
- Optional fields should be marked as optional in TypeScript interfaces
- **Solution**: Use `?.` optional chaining in components

## 🔍 Debugging Tips

### Common Issues
1. **Build Failures**: Check meal markdown frontmatter matches schema
2. **Runtime Errors**: Ensure optional fields are handled with `?.`
3. **Styling Issues**: Check CSS class names match component usage
4. **Content Not Loading**: Verify content collection config is correct

### Debug Commands
```bash
pnpm build            # Check for build errors
pnpm astro check      # Type checking
```

## 🎯 Common Tasks for AI Agents

### Adding Features
1. **New Meal Fields**: Update schema in `config.ts`, TypeScript interface, and component
2. **New Swipe Actions**: Modify `MealTinder.tsx` swipe handlers
3. **Styling Changes**: Update `global.css` classes
4. **New Pages**: Create `.astro` files in `src/pages/`

### Content Management
1. **Add Meals**: Create markdown files in `src/content/meals/`
2. **Update Schema**: Modify `src/content/config.ts`
3. **Bulk Operations**: Use Astro's content collection APIs

### Performance Optimization
1. **Image Optimization**: Add Astro's Image component
2. **Bundle Size**: Check for unused dependencies
3. **Loading States**: Add skeleton loaders

## 📚 Key Documentation Links

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [react-tinder-card GitHub](https://github.com/3DJakob/react-tinder-card)

## 🔒 Security Considerations

- No user authentication required
- Static site generation
- No sensitive data handling
- Content is public by design

## 🚀 Deployment

The app builds to static files in `dist/` directory and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 📝 Code Style Guidelines

- Use TypeScript interfaces for type safety
- Follow Astro's component patterns
- Use semantic HTML elements
- Maintain responsive design principles
- Comment complex logic

## 🤝 Contributing Guidelines

1. Follow existing code patterns
2. Test changes with `pnpm build`
3. Update documentation if needed
4. Maintain backward compatibility with existing meal data

---

**Last Updated**: January 2025
**Project Version**: 0.0.1
**Astro Version**: 5.14.1