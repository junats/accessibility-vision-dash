# Vudu A11y - Mystical Accessibility Testing

🔮 **Unleash the power of accessibility testing with mystical precision**

Vudu A11y is a modern, beautiful accessibility testing tool powered by pa11y that provides comprehensive WCAG compliance reports for your websites.

## ✨ Features

- **Modern Dark Theme** - Inspired by nivas.hr design with custom color palette
- **Real-time Scanning** - Powered by pa11y for comprehensive accessibility testing
- **Beautiful Dashboard** - Glass morphism effects with detailed issue breakdown
- **WCAG Compliance** - Full WCAG 2.1 AA compliance testing
- **Responsive Design** - Works perfectly on all devices
- **Themeable** - Easy to customize colors and branding

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker (for Devilbox setup)

### Installation

1. **Clone or download this project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐳 Docker/Devilbox Setup

This project is designed to work perfectly with Devilbox:

1. **Place project in your Devilbox htdocs:**
   ```bash
   /shared/httpd/vudu-a11y/
   ```

2. **Access via Devilbox:**
   ```
   http://vudu-a11y.loc:8080
   ```

3. **For pa11y backend integration:**
   - Set up a Node.js container in Devilbox
   - Install pa11y in your backend service
   - Create API endpoints for accessibility scanning

## 🔧 Backend Integration (pa11y)

Currently using mock data. To integrate real pa11y:

### 1. Create Backend API

```javascript
// Example Express.js endpoint
app.post('/api/scan', async (req, res) => {
  const { url } = req.body;
  
  try {
    const results = await pa11y(url, {
      standard: 'WCAG2AA',
      includeNotices: false,
      includeWarnings: true
    });
    
    res.json({
      url,
      timestamp: new Date().toISOString(),
      issues: results.map(issue => ({
        type: issue.type,
        code: issue.code,
        message: issue.message,
        selector: issue.selector,
        context: issue.context
      })),
      // Add summary stats
      passed: results.filter(r => r.type === 'notice').length,
      failed: results.filter(r => r.type === 'error').length,
      warnings: results.filter(r => r.type === 'warning').length
    });
  } catch (error) {
    res.status(500).json({ error: 'Scan failed' });
  }
});
```

### 2. Update Frontend

Replace the mock function in `src/components/AccessibilityScanner.tsx`:

```javascript
const handleScan = async () => {
  // Replace mock timeout with real API call
  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  
  const result = await response.json();
  setScanResult(result);
};
```

## 🎨 Customization

### Colors
Edit `src/index.css` to customize the color palette:

```css
:root {
  --primary: 191 71% 43%;      /* #1F9DB9 */
  --secondary: 273 75% 22%;    /* #330E62 */
  --accent: 208 49% 44%;       /* #3A6EA5 */
  /* Add your custom colors */
}
```

### Branding
Update branding in `src/components/AccessibilityScanner.tsx`

## 📁 Project Structure

```
vudu-a11y/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   └── AccessibilityScanner.tsx
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── index.css            # Design system
├── public/
├── tailwind.config.ts       # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── package.json
```

## 🛠 Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **Build Tool:** Vite
- **Accessibility Testing:** pa11y (backend integration needed)
- **Icons:** Lucide React
- **Animations:** Custom CSS + Tailwind

## 🌙 Theme Support

The app includes a complete theming system:
- Dark theme (default)
- Light theme ready
- Custom color tokens
- Glass morphism effects
- Gradient animations

## 📝 Development Notes

- All colors use HSL format for better theming
- Components use design system tokens (no hardcoded colors)
- Responsive design with mobile-first approach
- Accessibility-first development
- Modern CSS features (backdrop-filter, custom properties)

## 🔮 Mystical Features

- Gradient text effects
- Glow animations
- Glass morphism cards
- Smooth page transitions
- Magical loading states

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

**Made with ✨ mystical precision**
