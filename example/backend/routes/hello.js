const express = require('express');
const router = express.Router();

/**
 * Hello World API routes demonstrating Express.js best practices
 * Features:
 * - RESTful endpoint design
 * - Consistent response format
 * - Input validation
 * - Error handling
 * - Documentation
 */

// Sample data for demonstration
const greetings = [
  'Hello, World!',
  'Hello from Claude Code!',
  'Greetings from the best practices demo!',
  'Welcome to AI-assisted development!',
  'Hello, fellow developer!',
];

/**
 * GET /api/hello - Get a hello world message
 * Returns a random greeting from the predefined list
 */
router.get('/', async (req, res) => {
  try {
    // Simulate some async processing (e.g., database query)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const randomIndex = Math.floor(Math.random() * greetings.length);
    const message = greetings[randomIndex];
    
    res.json({
      success: true,
      data: {
        message,
        timestamp: new Date().toISOString(),
        source: 'api',
        greeting_id: randomIndex,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate greeting',
    });
  }
});

/**
 * POST /api/hello/custom - Create a custom hello message
 * Body: { name: string, language?: string }
 */
router.post('/custom', async (req, res) => {
  try {
    const { name, language = 'en' } = req.body;
    
    // Input validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Name is required and must be a string',
      });
    }
    
    if (name.length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Name must be 50 characters or less',
      });
    }
    
    // Sanitize input
    const sanitizedName = name.trim().replace(/[<>\"'&]/g, '');
    
    if (!sanitizedName) {
      return res.status(400).json({
        success: false,
        error: 'Name contains only invalid characters',
      });
    }
    
    // Generate customized greeting based on language
    const greetingTemplates = {
      en: `Hello, ${sanitizedName}!`,
      es: `¡Hola, ${sanitizedName}!`,
      fr: `Bonjour, ${sanitizedName}!`,
      de: `Hallo, ${sanitizedName}!`,
      it: `Ciao, ${sanitizedName}!`,
      pt: `Olá, ${sanitizedName}!`,
    };
    
    const message = greetingTemplates[language] || greetingTemplates.en;
    
    res.json({
      success: true,
      data: {
        message,
        name: sanitizedName,
        language,
        timestamp: new Date().toISOString(),
        source: 'custom',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create custom greeting',
    });
  }
});

/**
 * GET /api/hello/languages - Get supported languages
 */
router.get('/languages', (req, res) => {
  try {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
    ];
    
    res.json({
      success: true,
      data: {
        languages,
        total: languages.length,
        default: 'en',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported languages',
    });
  }
});

/**
 * GET /api/hello/stats - Get API usage statistics (demo endpoint)
 */
let requestCount = 0;
const startTime = new Date();

router.use((req, res, next) => {
  requestCount++;
  next();
});

router.get('/stats', (req, res) => {
  try {
    const uptime = Date.now() - startTime.getTime();
    
    res.json({
      success: true,
      data: {
        total_requests: requestCount,
        uptime_ms: uptime,
        uptime_readable: formatUptime(uptime),
        average_requests_per_minute: requestCount / (uptime / 60000),
        server_start: startTime.toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate statistics',
    });
  }
});

// Utility function for formatting uptime
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

module.exports = router;