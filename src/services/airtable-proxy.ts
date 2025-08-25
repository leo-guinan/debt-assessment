import { QuizResult, QuizAnswer } from '../types/quiz';
import { questions } from '../data/questions';

/**
 * Airtable Proxy Service for Secure Frontend Deployment
 * 
 * This service submits quiz responses through a proxy endpoint
 * to keep the Airtable API key secure on the server side.
 * 
 * For production deployment, you'll need to:
 * 1. Set up a backend API endpoint (e.g., /api/submit-quiz)
 * 2. Store the Airtable credentials securely on the server
 * 3. Configure CORS and rate limiting on the server
 */

const PROXY_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/api/submit-quiz';

export async function submitQuizToAirtableProxy(result: QuizResult): Promise<string> {
  try {
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare the submission data
    const submissionData = {
      responseId,
      mainRecord: {
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
      },
      answerRecords: result.answers.map((answer: QuizAnswer) => {
        const question = questions.find(q => q.id === answer.questionId);
        
        return {
          'Response ID': responseId,
          'Question ID': answer.questionId,
          'Question Text': question?.question || '',
          'Answer Type': question?.type || 'multiple-choice',
          'Selected Option': answer.selectedOption,
          'Ranked Options': answer.rankedOptions ? JSON.stringify(answer.rankedOptions) : '',
          'Multi Select Options': answer.multiSelectOptions ? JSON.stringify(answer.multiSelectOptions) : ''
        };
      })
    };
    
    // Submit through proxy endpoint
    const response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submissionData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Submission failed: ${errorText}`);
    }
    
    const data = await response.json();
    return data.responseId || responseId;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    
    // Fallback: Store in localStorage if API fails
    try {
      const localStorageKey = `quiz_response_${Date.now()}`;
      localStorage.setItem(localStorageKey, JSON.stringify(result));
      console.log('Response saved locally as fallback:', localStorageKey);
    } catch (storageError) {
      console.error('Failed to save to localStorage:', storageError);
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to submit quiz response. Please try again.');
  }
}

/**
 * Test the proxy connection
 */
export async function testProxyConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${PROXY_ENDPOINT}/health`, {
      method: 'GET'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Proxy connection test failed:', error);
    return false;
  }
}