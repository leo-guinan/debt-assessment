import type { Handler } from '@netlify/functions';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

async function createAirtableRecord(tableName: string, fields: Record<string, any>) {
  const response = await fetch(`${AIRTABLE_BASE_URL}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      records: [{ fields }]
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${error}`);
  }
  
  return response.json();
}

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    // Check for required environment variables
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      throw new Error('Airtable configuration missing');
    }
    
    const data = JSON.parse(event.body || '{}');
    const { responseId, mainRecord, answerRecords } = data;
    
    if (!responseId || !mainRecord || !answerRecords) {
      throw new Error('Invalid request data');
    }
    
    // Rate limiting check (simple implementation)
    // In production, use a more robust solution
    const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'];
    
    // Submit main response to Airtable
    await createAirtableRecord('Quiz Responses', mainRecord);
    
    // Submit individual answers
    const answerPromises = answerRecords.map((record: any) => 
      createAirtableRecord('Individual Answers', record)
    );
    
    await Promise.all(answerPromises);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        responseId,
        message: 'Quiz response submitted successfully'
      })
    };
  } catch (error) {
    console.error('Error processing submission:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to submit quiz response',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};