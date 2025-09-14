#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DopeTech Nepal - Production Optimization Script\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`\n${colors.blue}${description}...${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Main optimization process
async function optimizeProduction() {
  log('🎯 Starting production optimization process...', 'bold');
  
  // 1. Clean previous builds
  runCommand('rm -rf .next out', 'Cleaning previous builds');
  
  // 2. Install dependencies
  runCommand('npm ci --production=false', 'Installing dependencies');
  
  // 3. Type checking
  runCommand('npm run type-check', 'Running TypeScript type checking');
  
  // 4. Linting
  runCommand('npm run lint', 'Running ESLint');
  
  // 5. Build with optimizations
  runCommand('NODE_ENV=production npm run build', 'Building optimized production bundle');
  
  // 6. Generate sitemap
  runCommand('npm run postbuild', 'Generating sitemap');
  
  // 7. Bundle analysis
  runCommand('npm run analyze-bundle', 'Analyzing bundle size');
  
  // 8. Check build output
  const buildDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(buildDir)) {
    log('\n📊 Build Analysis:', 'bold');
    
    // Check static files
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      const analyzeDirectory = (dir, prefix = '') => {
        const items = fs.readdirSync(dir);
        let totalSize = 0;
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            const subSize = analyzeDirectory(itemPath, prefix + '  ');
            totalSize += subSize;
          } else {
            const size = stats.size;
            totalSize += size;
            const sizeKB = (size / 1024).toFixed(2);
            const sizeColor = size > 100000 ? 'red' : size > 50000 ? 'yellow' : 'green';
            log(`${prefix}${item}: ${sizeKB} KB`, sizeColor);
          }
        });
        
        return totalSize;
      };
      
      const totalSize = analyzeDirectory(staticDir);
      const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
      
      log(`\n📦 Total bundle size: ${totalSizeMB} MB`, totalSizeMB > 2 ? 'red' : totalSizeMB > 1 ? 'yellow' : 'green');
      
      // Performance recommendations
      log('\n💡 Performance Recommendations:', 'bold');
      
      if (totalSize > 2 * 1024 * 1024) {
        log('⚠️  Bundle size is large (>2MB). Consider:', 'yellow');
        log('   - Code splitting heavy components', 'yellow');
        log('   - Tree shaking unused code', 'yellow');
        log('   - Dynamic imports for non-critical features', 'yellow');
      } else if (totalSize < 500 * 1024) {
        log('✅ Bundle size is optimal (<500KB)', 'green');
      } else {
        log('✅ Bundle size is good (<1MB)', 'green');
      }
    }
  }
  
  // 9. Check for common issues
  log('\n🔍 Checking for common issues...', 'bold');
  
  // Check for large images
  const publicDir = path.join(process.cwd(), 'public');
  if (fs.existsSync(publicDir)) {
    const checkImages = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          checkImages(itemPath);
        } else if (item.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
          const size = stats.size;
          if (size > 500000) { // 500KB
            log(`⚠️  Large image detected: ${itemPath} (${(size / 1024).toFixed(2)} KB)`, 'yellow');
          }
        }
      });
    };
    
    checkImages(publicDir);
  }
  
  // 10. Generate performance report
  const reportPath = path.join(process.cwd(), 'performance-report.txt');
  const report = `
DopeTech Nepal - Performance Optimization Report
Generated: ${new Date().toISOString()}

Build Status: ✅ Success
Bundle Size: ${totalSizeMB} MB
TypeScript: ✅ Passed
ESLint: ✅ Passed
Sitemap: ✅ Generated

Next Steps:
1. Test the production build locally
2. Run Lighthouse audit
3. Deploy to production
4. Monitor performance metrics

Performance Tips:
- Enable gzip compression on server
- Use CDN for static assets
- Monitor Core Web Vitals
- Set up performance budgets
  `;
  
  fs.writeFileSync(reportPath, report);
  log(`\n📄 Performance report saved to: ${reportPath}`, 'green');
  
  // 11. Final success message
  log('\n🎉 Production optimization completed successfully!', 'bold');
  log('\nNext steps:', 'blue');
  log('1. Test the build: npm run start', 'blue');
  log('2. Run Lighthouse: npm run lighthouse', 'blue');
  log('3. Deploy to production', 'blue');
  log('4. Monitor performance metrics', 'blue');
  
  log('\n🚀 Your site is ready for production deployment!', 'green');
}

// Run the optimization
optimizeProduction().catch(error => {
  log(`❌ Optimization failed: ${error.message}`, 'red');
  process.exit(1);
});
