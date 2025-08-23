import { QuizAnswer, ProfileScore, QuizResult } from '../types/quiz';
import { questions } from '../data/questions';

export function calculateQuizResult(answers: QuizAnswer[], freeformResponse?: string, contactInfo?: string): QuizResult {
  const profileScores: ProfileScore = {
    student: 0,
    credit: 0,
    medical: 0,
    mortgage: 0,
    multi: 0,
    solidarity: 0
  };

  let readinessScore = 0;

  // Calculate scores based on answers
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    
    // Handle multi-select questions (question 5)
    if (question?.type === 'multi-select' && answer.multiSelectOptions) {
      answer.multiSelectOptions.forEach(optionValue => {
        const option = question.options.find(opt => opt.value === optionValue);
        if (option?.scoring) {
          // Add profile scores
          if (option.scoring.profiles) {
            Object.entries(option.scoring.profiles).forEach(([profile, points]) => {
              if (points) {
                profileScores[profile as keyof ProfileScore] += points;
              }
            });
          }
          
          // Add readiness score
          if (option.scoring.readiness) {
            readinessScore += option.scoring.readiness;
          }
        }
      });
    } else if (question?.type === 'drag-drop' && answer.rankedOptions) {
    // Handle drag-drop questions (question 1)
      // Score based on ranking - highest debt gets more weight
      answer.rankedOptions.forEach((optionValue, index) => {
        const option = question.options.find(opt => opt.value === optionValue);
        if (option?.scoring?.profiles) {
          // Weight: first item gets full points, subsequent items get decreasing weight
          const weight = Math.max(0.3, 1 - (index * 0.2));
          Object.entries(option.scoring.profiles).forEach(([profile, points]) => {
            if (points) {
              profileScores[profile as keyof ProfileScore] += points * weight;
            }
          });
        }
        
        // Add readiness score for first ranked item only
        if (index === 0 && option?.scoring?.readiness) {
          readinessScore += option.scoring.readiness;
        }
      });
    } else {
      // Handle regular multiple choice questions
      const selectedOption = question?.options.find(opt => opt.value === answer.selectedOption);
      
      if (selectedOption?.scoring) {
        // Add profile scores
        if (selectedOption.scoring.profiles) {
          Object.entries(selectedOption.scoring.profiles).forEach(([profile, points]) => {
            if (points) {
              profileScores[profile as keyof ProfileScore] += points;
            }
          });
        }
        
        // Add readiness score
        if (selectedOption.scoring.readiness) {
          readinessScore += selectedOption.scoring.readiness;
        }
      }
    }
  });

  // Analyze freeform response for additional scoring
  if (freeformResponse && freeformResponse.trim()) {
    const response = freeformResponse.toLowerCase();
    
    // Check for solidarity/community keywords
    if (response.includes('helping others') || response.includes('community') || response.includes('solidarity')) {
      readinessScore += 10;
      profileScores.solidarity += 1;
    }
    
    // Check for desperation keywords
    if (response.includes('escape debt') || response.includes('bankruptcy') || response.includes('desperate')) {
      readinessScore += 15;
    }
    
    // Check for alternative economy keywords
    if (response.includes('skills') || response.includes('barter') || response.includes('time banking')) {
      readinessScore += 10;
    }
    
    // Check for past debt freedom
    if (response.includes('debt free') || response.includes('paid off') || response.includes('escaped debt')) {
      profileScores.solidarity += 1;
    }
  }

  // Cap readiness score at 100
  readinessScore = Math.min(100, readinessScore);

  // Determine primary profile
  const primaryProfile = determinePrimaryProfile(profileScores);
  
  // Determine readiness level
  const readinessLevel = getReadinessLevel(readinessScore);
  
  // Generate recommendations
  const recommendations = generateRecommendations(primaryProfile.type, readinessLevel, readinessScore);

  return {
    answers,
    freeformResponse,
    contactInfo,
    profileScores,
    primaryProfile,
    readinessScore,
    readinessLevel,
    recommendations
  };
}

function determinePrimaryProfile(scores: ProfileScore) {
  const profiles = [
    { type: 'student' as const, name: 'Student Loan Struggler', score: scores.student },
    { type: 'credit' as const, name: 'Credit Card Cycler', score: scores.credit },
    { type: 'medical' as const, name: 'Medical Debt Survivor', score: scores.medical },
    { type: 'mortgage' as const, name: 'Asset-Secured Borrower', score: scores.mortgage },
    { type: 'multi' as const, name: 'Multi-Generational Carrier', score: scores.multi },
    { type: 'solidarity' as const, name: 'Solidarity Participant', score: scores.solidarity }
  ];

  // Sort by score, with Multi-Generational and Solidarity taking precedence in ties
  profiles.sort((a, b) => {
    if (a.score === b.score) {
      if (a.type === 'multi' || a.type === 'solidarity') return -1;
      if (b.type === 'multi' || b.type === 'solidarity') return 1;
      return 0;
    }
    return b.score - a.score;
  });

  const topProfile = profiles[0];
  const matchPercentage = Math.min(95, 60 + (topProfile.score * 10));

  return {
    type: topProfile.type,
    name: topProfile.name,
    matchPercentage
  };
}

function getReadinessLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

function generateRecommendations(profileType: keyof ProfileScore, readinessLevel: string, readinessScore: number): string[] {
  const baseRecommendations = {
    high: [
      'Direct engagement with mutual aid networks in your area',
      'Explore cooperative housing options',
      'Consider joining debt resistance movements',
      'Connect with community-based financial alternatives'
    ],
    medium: [
      'Start with small collaborative economic experiments',
      'Join debt support communities and groups',
      'Explore hybrid approaches combining traditional and alternative methods',
      'Gradually build community connections'
    ],
    low: [
      'Focus on financial literacy and conventional debt reduction',
      'Explore traditional consolidation and payment plan options',
      'Begin gradual community building activities',
      'Research alternative economic models at your own pace'
    ]
  };

  const profileSpecificRecommendations = {
    student: [
      'Research income-driven repayment plans',
      'Connect with other graduates facing similar challenges',
      'Explore cooperative living to reduce expenses'
    ],
    credit: [
      'Consider debt consolidation options',
      'Explore balance transfer opportunities',
      'Join credit counseling programs'
    ],
    medical: [
      'Research medical debt forgiveness programs',
      'Connect with patient advocacy groups',
      'Explore mutual aid networks for medical expenses'
    ],
    mortgage: [
      'Investigate housing cooperatives',
      'Explore co-housing communities',
      'Consider house hacking strategies'
    ],
    multi: [
      'Connect with multigenerational support networks',
      'Explore cooperative childcare/eldercare options',
      'Consider community resource sharing programs'
    ],
    solidarity: [
      'Share your debt-free strategies with others',
      'Consider mentoring those struggling with debt',
      'Explore ways to support community financial wellness',
      'Join or create mutual aid networks in your area'
    ]
  };

  return [
    ...baseRecommendations[readinessLevel as keyof typeof baseRecommendations],
    ...profileSpecificRecommendations[profileType]
  ];
}