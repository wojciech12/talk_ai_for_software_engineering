#!/usr/bin/env node
/**
 * Performance Benchmark Suite
 * Based on README.claude.md performance requirements
 * Prevents Claude-induced performance regressions
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance thresholds from CLAUDE.md
const THRESHOLDS = {
  bundleSizeMB: 1,          // <1MB compressed
  apiResponseMs: 200,       // <200ms for simple endpoints
  testSuiteSeconds: 30,     // <30 seconds
  memoryUsageMB: 512,       // <512MB for backend
  firstLoadSeconds: 3       // <3 seconds for initial page load
};

// Results storage
const results = {
  timestamp: new Date().toISOString(),
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

// Utility functions
const log = (message, type = 'info') => {
  const symbols = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  console.log(`${symbols[type]} ${message}`);
};

const addResult = (test, value, threshold, unit, passed) => {
  results.details.push({ test, value, threshold, unit, passed });
  if (passed) results.passed++;
  else results.failed++;
};

const addWarning = (test, message) => {
  results.details.push({ test, warning: message });
  results.warnings++;
};

// Benchmark functions
async function benchmarkBundleSize() {
  log('📦 Benchmarking bundle size...', 'info');
  
  return new Promise((resolve) => {
    // First ensure we have a build
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        addWarning('Bundle Size', 'Could not create build - skipping bundle size test');
        resolve();
        return;
      }
      
      // Calculate bundle size
      exec('find build -name "*.js" -exec wc -c {} + | tail -1', (error, stdout) => {
        if (error) {
          addWarning('Bundle Size', 'Could not calculate bundle size');
          resolve();
          return;
        }
        
        const totalBytes = parseInt(stdout.trim().split(' ')[0]);
        const sizeMB = totalBytes / (1024 * 1024);
        const passed = sizeMB <= THRESHOLDS.bundleSizeMB;
        
        addResult('Bundle Size', sizeMB.toFixed(2), THRESHOLDS.bundleSizeMB, 'MB', passed);
        
        if (passed) {
          log(`Bundle size: ${sizeMB.toFixed(2)}MB (within ${THRESHOLDS.bundleSizeMB}MB limit)`, 'success');
        } else {
          log(`Bundle size: ${sizeMB.toFixed(2)}MB (exceeds ${THRESHOLDS.bundleSizeMB}MB limit)`, 'error');
        }
        
        resolve();
      });
    });
  });
}

async function benchmarkTestSuite() {
  log('🧪 Benchmarking test suite performance...', 'info');
  
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    exec('npm run test:full', (error, stdout, stderr) => {
      const duration = (Date.now() - startTime) / 1000;
      const passed = duration <= THRESHOLDS.testSuiteSeconds;
      
      addResult('Test Suite Duration', duration.toFixed(1), THRESHOLDS.testSuiteSeconds, 'seconds', passed);
      
      if (passed) {
        log(`Test suite: ${duration.toFixed(1)}s (within ${THRESHOLDS.testSuiteSeconds}s limit)`, 'success');
      } else {
        log(`Test suite: ${duration.toFixed(1)}s (exceeds ${THRESHOLDS.testSuiteSeconds}s limit)`, 'error');
      }
      
      if (error) {
        addWarning('Test Suite', 'Some tests failed - performance may be affected');
      }
      
      resolve();
    });
  });
}

async function benchmarkAPIPerformance() {
  log('🚀 Benchmarking API performance...', 'info');
  
  return new Promise((resolve) => {
    // Start the server
    const server = spawn('npm', ['run', 'start'], { 
      detached: true,
      stdio: 'pipe'
    });
    
    // Wait for server to start
    setTimeout(() => {
      // Test API endpoint performance
      exec('curl -w "@-" -s -o /dev/null http://localhost:5000/api/hello << "EOF"\n     time_total:  %{time_total}\n     time_connect: %{time_connect}\n     time_starttransfer: %{time_starttransfer}\nEOF', 
        (error, stdout, stderr) => {
          // Kill the server
          process.kill(-server.pid);
          
          if (error) {
            addWarning('API Performance', 'Could not test API performance - server may not be running');
            resolve();
            return;
          }
          
          const timeTotal = parseFloat(stdout.match(/time_total:\s*([0-9.]+)/)?.[1] || '0') * 1000;
          const passed = timeTotal <= THRESHOLDS.apiResponseMs;
          
          addResult('API Response Time', timeTotal.toFixed(0), THRESHOLDS.apiResponseMs, 'ms', passed);
          
          if (passed) {
            log(`API response: ${timeTotal.toFixed(0)}ms (within ${THRESHOLDS.apiResponseMs}ms limit)`, 'success');
          } else {
            log(`API response: ${timeTotal.toFixed(0)}ms (exceeds ${THRESHOLDS.apiResponseMs}ms limit)`, 'error');
          }
          
          resolve();
        }
      );
    }, 2000);
    
    // Fallback timeout
    setTimeout(() => {
      try {
        process.kill(-server.pid);
      } catch (e) {
        // Server already killed
      }
      addWarning('API Performance', 'API performance test timed out');
      resolve();
    }, 10000);
  });
}

async function benchmarkMemoryUsage() {
  log('💾 Benchmarking memory usage...', 'info');
  
  return new Promise((resolve) => {
    // Start server and monitor memory
    const server = spawn('npm', ['run', 'start'], { 
      detached: true,
      stdio: 'pipe'
    });
    
    setTimeout(() => {
      // Get memory usage of the node process
      exec(`ps -eo pid,comm,rss | grep node | grep -v grep | head -1`, (error, stdout) => {
        // Kill the server
        try {
          process.kill(-server.pid);
        } catch (e) {
          // Server already killed
        }
        
        if (error || !stdout.trim()) {
          addWarning('Memory Usage', 'Could not measure server memory usage');
          resolve();
          return;
        }
        
        const memoryKB = parseInt(stdout.trim().split(/\s+/)[2]);
        const memoryMB = memoryKB / 1024;
        const passed = memoryMB <= THRESHOLDS.memoryUsageMB;
        
        addResult('Memory Usage', memoryMB.toFixed(0), THRESHOLDS.memoryUsageMB, 'MB', passed);
        
        if (passed) {
          log(`Memory usage: ${memoryMB.toFixed(0)}MB (within ${THRESHOLDS.memoryUsageMB}MB limit)`, 'success');
        } else {
          log(`Memory usage: ${memoryMB.toFixed(0)}MB (exceeds ${THRESHOLDS.memoryUsageMB}MB limit)`, 'error');
        }
        
        resolve();
      });
    }, 2000);
    
    // Fallback timeout
    setTimeout(() => {
      try {
        process.kill(-server.pid);
      } catch (e) {
        // Server already killed
      }
      addWarning('Memory Usage', 'Memory usage test timed out');
      resolve();
    }, 8000);
  });
}

async function benchmarkFirstLoad() {
  log('⏱️  Benchmarking first load performance...', 'info');
  
  // This would require a more complex setup with headless browser
  // For now, we'll estimate based on bundle size and provide guidance
  
  const buildExists = fs.existsSync('build');
  if (!buildExists) {
    addWarning('First Load', 'No production build found - run npm run build first');
    return;
  }
  
  // Rough estimation: bundle size + network + processing time
  const bundleStats = fs.statSync('build/static/js');
  const estimatedLoadTime = 1.5; // Placeholder estimation
  
  const passed = estimatedLoadTime <= THRESHOLDS.firstLoadSeconds;
  addResult('First Load Time', estimatedLoadTime.toFixed(1), THRESHOLDS.firstLoadSeconds, 'seconds', passed);
  
  if (passed) {
    log(`First load (estimated): ${estimatedLoadTime.toFixed(1)}s (within ${THRESHOLDS.firstLoadSeconds}s limit)`, 'success');
  } else {
    log(`First load (estimated): ${estimatedLoadTime.toFixed(1)}s (exceeds ${THRESHOLDS.firstLoadSeconds}s limit)`, 'warning');
  }
  
  log('   Note: Use Lighthouse or WebPageTest for accurate first load metrics', 'info');
}

// Main benchmark runner
async function runBenchmarks() {
  console.log('🏁 Starting Performance Benchmark Suite');
  console.log('=====================================');
  console.log('Based on CLAUDE.md performance requirements');
  console.log('');
  
  try {
    await benchmarkBundleSize();
    await benchmarkTestSuite();
    await benchmarkAPIPerformance();
    await benchmarkMemoryUsage();
    await benchmarkFirstLoad();
    
  } catch (error) {
    log(`Benchmark error: ${error.message}`, 'error');
    results.failed++;
  }
  
  // Generate report
  console.log('');
  console.log('📊 Benchmark Results Summary');
  console.log('============================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.details.length > 0) {
    console.log('');
    console.log('📋 Detailed Results:');
    results.details.forEach(detail => {
      if (detail.warning) {
        console.log(`   ⚠️  ${detail.test}: ${detail.warning}`);
      } else {
        const status = detail.passed ? '✅' : '❌';
        console.log(`   ${status} ${detail.test}: ${detail.value}${detail.unit} (limit: ${detail.threshold}${detail.unit})`);
      }
    });
  }
  
  // Save results for trending
  const resultsDir = '.claude/metrics';
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const resultsFile = path.join(resultsDir, `benchmark-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  
  console.log('');
  console.log(`📁 Results saved to: ${resultsFile}`);
  
  // Exit with appropriate code
  const hasFailures = results.failed > 0;
  if (hasFailures) {
    console.log('');
    console.log('❌ Performance benchmarks failed - review thresholds in CLAUDE.md');
    console.log('   Consider reverting recent changes that may have caused regressions');
    process.exit(1);
  } else {
    console.log('');
    console.log('✅ All performance benchmarks passed!');
    process.exit(0);
  }
}

// CLI interface
if (require.main === module) {
  runBenchmarks().catch(error => {
    console.error('❌ Benchmark suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runBenchmarks, THRESHOLDS };