#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size and performance...\n');

// Run bundle analyzer
try {
  console.log('📊 Running Next.js bundle analyzer...');
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' });
  console.log('✅ Bundle analysis complete!\n');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}

// Check bundle size
const buildDir = path.join(process.cwd(), '.next');
const staticDir = path.join(buildDir, 'static');

if (fs.existsSync(staticDir)) {
  console.log('📦 Bundle size analysis:');
  
  const analyzeDir = (dir, prefix = '') => {
    const items = fs.readdirSync(dir);
    let totalSize = 0;
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const subSize = analyzeDir(itemPath, prefix + '  ');
        totalSize += subSize;
      } else {
        const size = stats.size;
        totalSize += size;
        console.log(`${prefix}${item}: ${(size / 1024).toFixed(2)} KB`);
      }
    });
    
    return totalSize;
  };
  
  const totalSize = analyzeDir(staticDir);
  console.log(`\n📊 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  
  // Performance recommendations
  console.log('\n💡 Performance recommendations:');
  
  if (totalSize > 2 * 1024 * 1024) { // 2MB
    console.log('⚠️  Bundle size is large (>2MB). Consider:');
    console.log('   - Code splitting');
    console.log('   - Tree shaking unused code');
    console.log('   - Dynamic imports for heavy components');
  }
  
  if (totalSize < 500 * 1024) { // 500KB
    console.log('✅ Bundle size is optimal (<500KB)');
  }
}

console.log('\n🎯 Next steps:');
console.log('1. Check the generated bundle analyzer report');
console.log('2. Identify large dependencies');
console.log('3. Implement code splitting where needed');
console.log('4. Optimize images and assets');
console.log('5. Test performance with Lighthouse');
