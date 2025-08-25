import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy - required when behind load balancer (AWS ALB, CloudFront, etc)
app.set('trust proxy', true);

// Airtable configuration
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:*"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        'https://debt.leoasaservice.com',
        'https://dh3k78nj5f7q6.cloudfront.net'
      ].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Stricter rate limiting for submission endpoint
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 submissions per hour
  message: 'Too many submissions, please try again later.'
});

// Helper function to create Airtable records
async function createAirtableRecord(tableName, fields) {
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    throw new Error('Airtable configuration missing');
  }

  const response = await fetch(
    `${AIRTABLE_BASE_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{ fields }]
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${error}`);
  }

  return response.json();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    configured: !!(AIRTABLE_BASE_ID && AIRTABLE_API_KEY)
  });
});

// Main submission endpoint
app.post('/api/submit-quiz', submitLimiter, async (req, res) => {
  try {
    // Validate request body
    const { responseId, mainRecord, answerRecords } = req.body;
    
    if (!responseId || !mainRecord || !answerRecords) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        message: 'Missing required fields'
      });
    }

    // Validate Airtable configuration
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      console.error('Airtable configuration missing');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Please contact administrator'
      });
    }

    console.log(`Processing submission ${responseId} from ${req.ip}`);

    // Submit main response to Airtable
    await createAirtableRecord('Quiz Responses', mainRecord);
    console.log(`Main record created for ${responseId}`);

    // Submit individual answers
    const answerPromises = answerRecords.map((record) => 
      createAirtableRecord('Individual Answers', record)
    );
    
    await Promise.all(answerPromises);
    console.log(`${answerRecords.length} answer records created for ${responseId}`);

    res.json({ 
      success: true, 
      responseId,
      message: 'Quiz response submitted successfully'
    });

  } catch (error) {
    console.error('Error processing submission:', error);
    
    // Don't expose internal errors to client
    res.status(500).json({ 
      error: 'Failed to submit quiz response',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An error occurred while processing your submission'
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  // Handle client-side routing
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Airtable configured: ${!!(AIRTABLE_BASE_ID && AIRTABLE_API_KEY)}`);
  
  if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
    console.warn('⚠️  Airtable credentials not configured!');
    console.warn('Please set AIRTABLE_BASE_ID and AIRTABLE_API_KEY in your .env file');
  }
});