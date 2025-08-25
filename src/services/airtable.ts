import { QuizResult, QuizAnswer } from '../types/quiz';
import { questions } from '../data/questions';
import { submitQuizToAirtableProxy } from './airtable-proxy';

const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0';

interface AirtableConfig {
  baseId: string;
  apiKey: string;
}

function getAirtableConfig(): AirtableConfig | null {
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
  
  // If no direct API credentials, use proxy
  if (!baseId || !apiKey) {
    return null;
  }
  
  return { baseId, apiKey };
}

async function createRecord(tableName: string, fields: Record<string, any>) {
  const config = getAirtableConfig();
  if (!config) {
    throw new Error('Direct API not configured');
  }
  const { baseId, apiKey } = config;
  
  const response = await fetch(`${AIRTABLE_BASE_URL}/${baseId}/${encodeURIComponent(tableName)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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

export async function submitQuizToAirtable(result: QuizResult): Promise<string> {
  // Check if direct API is configured, otherwise use proxy
  const config = getAirtableConfig();
  if (!config) {
    console.log('Using proxy for Airtable submission');
    return submitQuizToAirtableProxy(result);
  }
  
  console.log('Using direct API for Airtable submission');
  try {
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const responseData = {
      'Response ID': responseId,
      'Submission Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format for Airtable
      'Primary Profile Type': result.primaryProfile.type,
      'Primary Profile Name': result.primaryProfile.name,
      'Match Percentage': result.primaryProfile.matchPercentage,
      'Readiness Score': result.readinessScore,
      'Readiness Level': result.readinessLevel,
      'Student Score': result.profileScores.student,
      'Credit Score': result.profileScores.credit,
      'Medical Score': result.profileScores.medical,
      'Mortgage Score': result.profileScores.mortgage,
      'Multi Score': result.profileScores.multi,
      'Solidarity Score': result.profileScores.solidarity,
      'Freeform Response': result.freeformResponse?.trim() || '',
      'Contact Info': result.contactInfo?.trim() || ''
    };
    
    await createRecord('Quiz Responses', responseData);
    
    const answerPromises = result.answers.map((answer: QuizAnswer) => {
      const question = questions.find(q => q.id === answer.questionId);
      
      const answerData = {
        'Response ID': responseId,
        'Question ID': answer.questionId,
        'Question Text': question?.question || '',
        'Answer Type': question?.type || 'multiple-choice',
        'Selected Option': answer.selectedOption,
        'Ranked Options': answer.rankedOptions ? JSON.stringify(answer.rankedOptions) : '',
        'Multi Select Options': answer.multiSelectOptions ? JSON.stringify(answer.multiSelectOptions) : ''
      };
      
      return createRecord('Individual Answers', answerData);
    });
    
    await Promise.all(answerPromises);
    
    return responseId;
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to submit quiz response. Please try again.');
  }
}

export async function testAirtableConnection(): Promise<boolean> {
  try {
    const config = getAirtableConfig();
    if (!config) {
      // Test proxy connection instead
      const { testProxyConnection } = await import('./airtable-proxy');
      return testProxyConnection();
    }
    const { baseId, apiKey } = config;
    
    const response = await fetch(`${AIRTABLE_BASE_URL}/${baseId}/Quiz%20Responses?maxRecords=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Airtable connection test failed:', error);
    return false;
  }
}