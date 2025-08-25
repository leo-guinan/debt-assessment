import { QuizResult, QuizAnswer } from '../types/quiz';
import { questions } from '../data/questions';

// Always use the Express server endpoint to protect API keys
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/api/submit-quiz';

export async function submitQuizToAirtable(result: QuizResult): Promise<string> {
  try {
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
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
    
    // Submit through Express server endpoint
    const response = await fetch(API_ENDPOINT, {
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

export async function testAirtableConnection(): Promise<boolean> {
  try {
    // Test the Express server health endpoint
    const healthEndpoint = API_ENDPOINT.replace('/submit-quiz', '/health');
    const response = await fetch(healthEndpoint, {
      method: 'GET'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.configured === true;
    }
    
    return false;
  } catch (error) {
    console.error('Airtable connection test failed:', error);
    return false;
  }
}