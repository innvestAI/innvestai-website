# InnvestAI Website

Modern website for InnvestAI - empowering hotel investment decisions with AI-driven data.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Visit http://localhost:8000
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AWS CLI (for deployment)

### Environment Setup

1. Copy the environment example:
```bash
cp env.example .env
```

2. Update the `.env` file with your configuration values.

### Available Scripts

```bash
# Development
npm start                 # Start development server
npm run build            # Build production assets
npm run lighthouse       # Run Lighthouse audit

# Code Quality
npm run lint:css         # Lint CSS files
npm run lint:js          # Lint JavaScript files  
npm run validate:html    # Validate HTML files

# Deployment
npm run deploy:dev       # Deploy to development
npm run deploy:staging   # Deploy to staging
npm run deploy:prod      # Deploy to production
```

## 🏗️ Architecture

### File Structure
```
innvestai-website/
├── .github/workflows/   # GitHub Actions CI/CD
├── assets/             # Images, icons, favicon
├── css/               # Stylesheets
├── js/                # JavaScript files
│   ├── config.js      # Environment configuration
│   └── main.js        # Main application logic
├── index.html         # Main HTML file
└── package.json       # Dependencies and scripts
```

### Configuration Management
- `js/config.js` - Centralized configuration
- `env.example` - Environment variables template
- Automatic environment detection (dev/staging/prod)

## 🚀 Deployment

### GitHub Actions Pipeline

The project includes a complete CI/CD pipeline that:

1. **Build & Test** - Runs on all pushes and PRs
   - Lints CSS, JavaScript, and validates HTML
   - Builds production assets
   - Runs security scans

2. **Deploy Staging** - Runs on `develop` branch
   - Deploys to staging S3 bucket
   - Invalidates CloudFront cache

3. **Deploy Production** - Runs on `main` branch  
   - Deploys to production S3 bucket
   - Invalidates CloudFront cache
   - Runs Lighthouse performance audit

### Required GitHub Secrets

Set these in your GitHub repository settings:

```
AWS_ACCESS_KEY_ID         # AWS access key
AWS_SECRET_ACCESS_KEY     # AWS secret key
LHCI_GITHUB_APP_TOKEN    # Lighthouse CI token (optional)
```

### Required GitHub Variables

Set these in your repository environments:

**Staging Environment:**
```
S3_BUCKET_STAGING                    # S3 bucket name
CLOUDFRONT_DISTRIBUTION_ID_STAGING   # CloudFront distribution ID
```

**Production Environment:**
```
S3_BUCKET_PRODUCTION                    # S3 bucket name  
CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION   # CloudFront distribution ID
```

### Manual Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production  
npm run deploy:prod
```

## 🔧 Configuration

### API Configuration
Update `js/config.js` to modify:
- API endpoints
- Timeout settings
- Feature flags
- Environment-specific overrides

### Form Handling
The contact form:
- Shows immediate success feedback
- Handles API failures gracefully
- Includes proper validation
- Supports different environments

## 🧪 Testing & Quality

### Lighthouse Audits
```bash
npm run lighthouse        # Local audit
npm run lighthouse:ci     # CI-compatible audit
```

### Code Quality
- ESLint for JavaScript
- Stylelint for CSS  
- HTML validation
- Trivy security scanning (in CI)

## 📱 Features

- **Responsive Design** - Mobile-first approach
- **Progressive Enhancement** - Works without JavaScript
- **Performance Optimized** - Lighthouse score 90+
- **Accessible** - WCAG 2.1 compliant
- **SEO Friendly** - Semantic HTML and meta tags

## 🔒 Security

- Content Security Policy headers
- HTTPS enforcement
- Input validation and sanitization
- Dependency vulnerability scanning

## 📊 Analytics & Monitoring

- Google Analytics integration (configurable)
- Lighthouse CI performance monitoring
- Error tracking and logging
- Form submission analytics

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run quality checks: `npm run lint:css && npm run lint:js && npm run validate:html`
4. Create a Pull Request to `develop`

## 📄 License

UNLICENSED - Private project for InnvestAI

---

**Built with ❤️ by the InnvestAI team**
