# Correct Airtable Schema for Individual Answers Table

## Current Issue
Your "Individual Answers" table appears to have test/sample data with incorrect fields. You need to clear this table and set up the correct schema.

## Required Schema for Individual Answers Table

The Individual Answers table should store the actual quiz answers from users. Each row represents one answer to one question from a quiz submission.

### Delete all existing fields and create these exact fields:

| Field Name | Field Type | Description | Example Value |
|------------|------------|-------------|---------------|
| ResponseID | Single line text | Links this answer to a quiz response | resp_1756140365143_b1tswgm |
| QuestionID | Number | The question number from the quiz | 1 |
| QuestionText | Long text | The actual question text | "What is your primary financial concern?" |
| AnswerType | Single line text | Type of question | "multiple-choice" or "ranking" or "multi-select" |
| SelectedOption | Single line text | For multiple-choice: the selected answer | "Credit card debt" |
| RankedOptions | Long text | For ranking questions: JSON array of ranked items | ["Option A", "Option B", "Option C"] |
| MultiSelectOptions | Long text | For multi-select: JSON array of selected items | ["Save for house", "Pay off debt", "Build emergency fund"] |

## Steps to Fix:

1. **In Airtable:**
   - Go to your "Individual Answers" table
   - Click the dropdown arrow next to the table name
   - Select "Delete all records" to clear the test data
   - Delete all existing fields except the primary field
   - Add the fields listed above with EXACT names (no spaces!)

2. **Field Configuration Details:**
   - **ResponseID**: Single line text, required
   - **QuestionID**: Number field, integer format, required
   - **QuestionText**: Long text field
   - **AnswerType**: Single line text (you could make this a single select with options: multiple-choice, ranking, multi-select)
   - **SelectedOption**: Single line text
   - **RankedOptions**: Long text (will store JSON strings)
   - **MultiSelectOptions**: Long text (will store JSON strings)

3. **What the data will look like:**

Example row for a multiple-choice question:
- ResponseID: `resp_1756140365143_b1tswgm`
- QuestionID: `1`
- QuestionText: `"What is your primary financial concern?"`
- AnswerType: `"multiple-choice"`
- SelectedOption: `"Credit card debt"`
- RankedOptions: (empty)
- MultiSelectOptions: (empty)

Example row for a ranking question:
- ResponseID: `resp_1756140365143_b1tswgm`
- QuestionID: `5`
- QuestionText: `"Rank these debt solutions by preference"`
- AnswerType: `"ranking"`
- SelectedOption: (empty)
- RankedOptions: `["Balance transfer", "Debt consolidation", "Payment plan"]`
- MultiSelectOptions: (empty)

## Why This Schema?

This schema stores the raw answer data from each quiz submission, allowing you to:
- Track which questions users answered
- See exactly what they selected
- Link answers back to the main quiz response
- Analyze patterns in how people answer specific questions
- Export and process the data for reporting

## After Fixing the Schema

Once you've updated the Airtable schema, the application will be able to successfully submit quiz responses without errors.