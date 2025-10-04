# 🍽️ Dinder - Meal Planning Made Fun

Dinder is a Tinder-style meal planning app built with Astro, React, and CSS. Swipe through delicious meal options to plan your weekly menu!

## ✨ Features

- **Tinder-style Swiping**: Swipe right to like meals, left to dislike
- **Meal Cards**: Clean, minimal cards showing meal images, names, and optional recipe links
- **Content Collections**: Meals stored as markdown files in Astro content collections
- **Responsive Design**: Works great on desktop and mobile
- **Modern UI**: Clean, modern interface with smooth animations

## 🚀 Tech Stack

- **Astro** - Static site generator
- **React** - Interactive components
- **react-tinder-card** - Swipe functionality
- **CSS** - Custom styling
- **TypeScript** - Type safety

## 📁 Project Structure

```
/
├── src/
│   ├── components/
│   │   └── MealTinder.tsx    # Main swiping component
│   ├── content/
│   │   ├── config.ts         # Content collection schema
│   │   └── meals/            # Meal markdown files
│   ├── pages/
│   │   └── index.astro       # Main page
│   └── styles/
│       └── global.css        # Custom CSS styles
├── astro.config.mjs
└── package.json
```

## 🍳 Adding New Meals

To add new meals, create markdown files in `src/content/meals/` with the following frontmatter:

```yaml
---
name: "Your Meal Name"
image: "https://images.unsplash.com/photo-1234567890?w=500&h=400&fit=crop"
url: "https://example.com/recipe" # Optional - link to recipe
---
```

## 🧞 Commands

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`     |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |

## 🎮 How to Use

1. Start the development server: `pnpm dev`
2. Open your browser to `http://localhost:4321`
3. Swipe right (❤️) on meals you'd like to cook
4. Swipe left (❌) on meals you don't want
5. Use the back button (↶) to undo your last swipe
6. View your liked and disliked meals at the bottom

## 🎨 Customization

- **Styling**: Modify `src/styles/global.css` to change colors, fonts, and layout
- **Meal Data**: Add more meal markdown files to `src/content/meals/`
- **Card Layout**: Update the `MealTinder.tsx` component to change how meal information is displayed

## 📱 Responsive Design

The app is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

Build the static site and deploy to any static hosting service:

```bash
pnpm build
```

The built files will be in the `dist/` directory.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).