import { Question } from '../types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    question: "Select and rank all types of debt you have, from highest amount to lowest:",
    type: 'drag-drop',
    options: [
      {
        label: "Student loans",
        value: "A",
        scoring: { profiles: { student: 1 } }
      },
      {
        label: "Credit cards",
        value: "B",
        scoring: { profiles: { credit: 1 } }
      },
      {
        label: "Medical bills",
        value: "C",
        scoring: { profiles: { medical: 1 } }
      },
      {
        label: "Mortgage/Home-related",
        value: "D",
        scoring: { profiles: { mortgage: 1 } }
      },
      {
        label: "Multiple sources equally",
        value: "E",
        scoring: { profiles: { multi: 1 } }
      },
      {
        label: "Car loan",
        value: "F",
        scoring: { profiles: { mortgage: 1 } }
      },
      {
        label: "Buy now, pay later (Klarna, Afterpay, etc.)",
        value: "G",
        scoring: { profiles: { credit: 1 } }
      },
      {
        label: "I have no debt",
        value: "H",
        scoring: { profiles: { solidarity: 1 } }
      }
    ]
  },
  {
    id: 2,
    question: "What percentage of your monthly income goes to debt payments?",
    options: [
      {
        label: "Less than 20%",
        value: "A",
        scoring: {}
      },
      {
        label: "20-40%",
        value: "B",
        scoring: {}
      },
      {
        label: "40-60%",
        value: "C",
        scoring: { readiness: 15, profiles: { multi: 1 } }
      },
      {
        label: "More than 60%",
        value: "D",
        scoring: { readiness: 15, profiles: { multi: 1 } }
      },
      {
        label: "0% - I have no debt",
        value: "E",
        scoring: { readiness: 5, profiles: { solidarity: 2 } }
      }
    ]
  },
  {
    id: 3,
    question: "Which describes your relationship with traditional debt solutions?",
    options: [
      {
        label: "Haven't tried many options yet",
        value: "A",
        scoring: {}
      },
      {
        label: "Currently using consolidation or payment plans",
        value: "B",
        scoring: {}
      },
      {
        label: "Used debt consolidation in the past but am now back in debt",
        value: "C",
        scoring: { readiness: 20 }
      },
      {
        label: "Tried multiple solutions without success",
        value: "D",
        scoring: { readiness: 20 }
      },
      {
        label: "Given up on traditional solutions",
        value: "E",
        scoring: { readiness: 20 }
      },
      {
        label: "Not applicable - I avoid debt on principle",
        value: "F",
        scoring: { readiness: 10, profiles: { solidarity: 2 } }
      }
    ]
  },
  {
    id: 4,
    question: "Are you supporting anyone else financially?",
    options: [
      {
        label: "No, just myself",
        value: "A",
        scoring: {}
      },
      {
        label: "Partner/Spouse",
        value: "B",
        scoring: {}
      },
      {
        label: "Children",
        value: "C",
        scoring: { readiness: 5, profiles: { multi: 1 } }
      },
      {
        label: "Aging parents",
        value: "D",
        scoring: { readiness: 5, profiles: { multi: 1 } }
      },
      {
        label: "Multiple generations",
        value: "E",
        scoring: { readiness: 10, profiles: { multi: 2 } }
      }
    ]
  },
  {
    id: 5,
    question: "Which alternative economic model interests you most?",
    options: [
      {
        label: "Cooperative ownership/sharing",
        value: "A",
        scoring: { readiness: 10 }
      },
      {
        label: "Mutual aid networks",
        value: "B",
        scoring: { readiness: 10 }
      },
      {
        label: "Community lending circles",
        value: "C",
        scoring: { readiness: 10 }
      },
      {
        label: "Time banks/Skill sharing",
        value: "D",
        scoring: { readiness: 10 }
      },
      {
        label: "All of the above",
        value: "E",
        scoring: { readiness: 15 }
      },
      {
        label: "I haven't heard of any of these options",
        value: "F",
        scoring: {}
      }
    ]
  },
  {
    id: 6,
    question: "What's your view on the current financial system?",
    options: [
      {
        label: "It works, I just need to use it better",
        value: "A",
        scoring: {}
      },
      {
        label: "Has flaws but can be navigated",
        value: "B",
        scoring: {}
      },
      {
        label: "Fundamentally broken",
        value: "C",
        scoring: { readiness: 15 }
      },
      {
        label: "Designed to exploit people",
        value: "D",
        scoring: { readiness: 15 }
      }
    ]
  },
  {
    id: 7,
    question: "How comfortable are you sharing your debt story publicly?",
    options: [
      {
        label: "Very private about finances",
        value: "A",
        scoring: {}
      },
      {
        label: "Share with close friends/family",
        value: "B",
        scoring: {}
      },
      {
        label: "Open in support groups",
        value: "C",
        scoring: { readiness: 10 }
      },
      {
        label: "Willing to advocate publicly",
        value: "D",
        scoring: { readiness: 10 }
      }
    ]
  },
  {
    id: 8,
    question: "What best describes your employment situation?",
    options: [
      {
        label: "Stable full-time employment",
        value: "A",
        scoring: {}
      },
      {
        label: "Multiple jobs/gig work",
        value: "B",
        scoring: { readiness: 5, profiles: { multi: 1 } }
      },
      {
        label: "Underemployed for my education",
        value: "C",
        scoring: { profiles: { student: 1 } }
      },
      {
        label: "Unstable/seeking work",
        value: "D",
        scoring: {}
      },
      {
        label: "Unable to work full-time",
        value: "E",
        scoring: { profiles: { medical: 1 } }
      }
    ]
  },
  {
    id: 9,
    question: "What's your timeline for getting out of debt?",
    options: [
      {
        label: "Need immediate relief",
        value: "A",
        scoring: { readiness: 10 }
      },
      {
        label: "Within 1-2 years",
        value: "B",
        scoring: {}
      },
      {
        label: "3-5 year plan",
        value: "C",
        scoring: {}
      },
      {
        label: "Long-term transformation",
        value: "D",
        scoring: {}
      },
      {
        label: "Accepted it as permanent",
        value: "E",
        scoring: { readiness: 5 }
      }
    ]
  },
  {
    id: 10,
    question: "Is there anything else about your financial situation or interest in collaborative economics that we haven't covered?",
    type: "freeform",
    options: [
      {
        label: "Optional text response",
        value: "freeform",
        scoring: {}
      }
    ]
  },
  {
    id: 11,
    question: "If you'd like us to follow up with you about this collaborative debt management platform, please share a way to contact you (email, social media handle, etc.). This is completely optional.",
    type: "freeform",
    options: [
      {
        label: "Optional contact information",
        value: "freeform",
        scoring: {}
      }
    ]
  }
];