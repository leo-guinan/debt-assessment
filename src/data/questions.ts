import { Question } from '../types/quiz';

export const questions: Question[] = [
  {
    id: 1,
    question: "Select and rank all types of debt you have, by total debt from highest to lowest:",
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
        label: "Car loan",
        value: "E",
        scoring: { profiles: { mortgage: 1 } }
      },
      {
        label: "Buy now, pay later (Klarna, Afterpay, etc.)",
        value: "F",
        scoring: { profiles: { credit: 1 } }
      },
      {
        label: "I have no debt",
        value: "G",
        scoring: { profiles: { solidarity: 1 } }
      }
    ]
  },
  {
    id: 2,
    question: "For each type of debt you have, what APR range does it fall into?",
    type: 'multi-select',
    options: [
      {
        label: "Credit Cards: 0-10%",
        value: "CC1",
        scoring: {}
      },
      {
        label: "Credit Cards: 10-15%",
        value: "CC2",
        scoring: {}
      },
      {
        label: "Credit Cards: 15-20%",
        value: "CC3",
        scoring: {}
      },
      {
        label: "Credit Cards: 20-25%",
        value: "CC4",
        scoring: {}
      },
      {
        label: "Credit Cards: 25%+",
        value: "CC5",
        scoring: { profiles: { credit: 1 } }
      },
      {
        label: "Mortgage: 1-3%",
        value: "M1",
        scoring: {}
      },
      {
        label: "Mortgage: 4-5%",
        value: "M2",
        scoring: {}
      },
      {
        label: "Mortgage: 6-8%",
        value: "M3",
        scoring: {}
      },
      {
        label: "Mortgage: 8%+",
        value: "M4",
        scoring: { profiles: { mortgage: 1 } }
      },
      {
        label: "Student Loans: 0-3%",
        value: "SL1",
        scoring: {}
      },
      {
        label: "Student Loans: 3-5%",
        value: "SL2",
        scoring: {}
      },
      {
        label: "Student Loans: 5-7%",
        value: "SL3",
        scoring: {}
      },
      {
        label: "Student Loans: 7%+",
        value: "SL4",
        scoring: { profiles: { student: 1 } }
      },
      {
        label: "Car Loan: 0-5%",
        value: "CL1",
        scoring: {}
      },
      {
        label: "Car Loan: 5-10%",
        value: "CL2",
        scoring: {}
      },
      {
        label: "Car Loan: 10%+",
        value: "CL3",
        scoring: {}
      },
      {
        label: "Not applicable - I have no debt",
        value: "NA",
        scoring: { profiles: { solidarity: 1 } }
      }
    ]
  },
  {
    id: 3,
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
    id: 4,
    question: "Which describes your relationship with traditional debt solutions?",
    options: [
      {
        label: "No need, I'm able to maintain my current obligations",
        value: "A",
        scoring: {}
      },
      {
        label: "Haven't tried many options yet",
        value: "B",
        scoring: {}
      },
      {
        label: "Currently using consolidation or payment plans",
        value: "C",
        scoring: {}
      },
      {
        label: "Used debt consolidation in the past but am now back in debt",
        value: "D",
        scoring: { readiness: 20 }
      },
      {
        label: "Tried multiple solutions without success",
        value: "E",
        scoring: { readiness: 20 }
      },
      {
        label: "Given up on traditional solutions",
        value: "F",
        scoring: { readiness: 20 }
      },
      {
        label: "Not applicable - I avoid debt on principle",
        value: "G",
        scoring: { readiness: 10, profiles: { solidarity: 2 } }
      }
    ]
  },
  {
    id: 5,
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
    id: 6,
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
        label: "Friends and/or Community",
        value: "E",
        scoring: { readiness: 5, profiles: { solidarity: 1 } }
      },
      {
        label: "Multiple generations",
        value: "F",
        scoring: { readiness: 10, profiles: { multi: 2 } }
      }
    ]
  },
  {
    id: 7,
    question: "Would you be interested in a cooperative/collaborative finance model that reduces your monthly payments and total cost of servicing your debt in a way that helps others do the same?",
    options: [
      {
        label: "Yes, definitely",
        value: "A",
        scoring: { readiness: 20 }
      },
      {
        label: "Yes, but I'd need to know more",
        value: "B",
        scoring: { readiness: 10 }
      },
      {
        label: "Maybe, depends on the specifics",
        value: "C",
        scoring: { readiness: 5 }
      },
      {
        label: "No, I prefer traditional approaches",
        value: "D",
        scoring: {}
      },
      {
        label: "Not applicable - I have no debt",
        value: "E",
        scoring: { profiles: { solidarity: 2 } }
      }
    ]
  },
  {
    id: 8,
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
    id: 9,
    question: "How comfortable are you sharing your debt story?",
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
        label: "Open in support groups/community",
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