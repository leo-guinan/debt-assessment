# Airtable Setup Instructions

## 1. Create Airtable Base

1. Go to [Airtable](https://airtable.com) and sign in
2. Create a new base called "Debt Assessment Quiz"
3. Note your Base ID (found in the API documentation or URL)

## 2. Create Tables

### Table 1: Quiz Responses

Create a table named "Quiz Responses" with these fields:

| Field Name | Field Type | Notes |
|------------|------------|-------|
| Response ID | Single line text | Primary field, unique identifier |
| Submission Date | Date with time | ISO format |
| Primary Profile Type | Single select | Options: student, credit, medical, mortgage, multi, solidarity |
| Primary Profile Name | Single line text | - |
| Match Percentage | Number | 0-100, integer |
| Readiness Score | Number | 0-100, integer |
| Readiness Level | Single select | Options: low, medium, high |
| Student Score | Number | Integer |
| Credit Score | Number | Integer |
| Medical Score | Number | Integer |
| Mortgage Score | Number | Integer |
| Multi Score | Number | Integer |
| Solidarity Score | Number | Integer |
| Freeform Response | Long text | Optional user input |
| Contact Info | Single line text | Optional contact details |
| Created At | Created time | Auto-generated |

### Table 2: Individual Answers

Create a table named "Individual Answers" with these fields:

| Field Name | Field Type | Notes |
|------------|------------|-------|
| ID | Autonumber | Primary field |
| Response ID | Single line text | Links to Quiz Responses |
| Question ID | Number | Integer |
| Question Text | Long text | - |
| Answer Type | Single select | Options: multiple-choice, freeform, drag-drop, multi-select |
| Selected Option | Single line text | - |
| Ranked Options | Long text | JSON array as string |
| Multi Select Options | Long text | JSON array as string |
| Created At | Created time | Auto-generated |

## 3. Get API Credentials

1. Go to [Airtable API](https://airtable.com/create/tokens)
2. Create a new personal access token
3. Give it the following scopes:
   - `data.records:read`
   - `data.records:write`
   - Select your "Debt Assessment Quiz" base
4. Copy the token (you won't be able to see it again)

## 4. Deployment Options

### Option A: Direct API (Development Only)

⚠️ **WARNING: Never use this in production as it exposes your API key!**

1. Create a `.env` file in the project root
2. Add your credentials:
```env
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_API_KEY=your_api_key
```
3. The app will use the direct Airtable API

### Option B: Proxy Server (Recommended for Production)

#### For Netlify:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Set environment variables in Netlify:
   - Go to Site Settings > Environment Variables
   - Add `AIRTABLE_BASE_ID` and `AIRTABLE_API_KEY`
3. The included Netlify function will handle submissions securely

#### For Vercel:

1. Create `/api/submit-quiz.ts` in your project
2. Copy the logic from the Netlify function
3. Set environment variables in Vercel dashboard

#### For Custom Backend:

1. Create an API endpoint that accepts POST requests
2. Implement the Airtable submission logic server-side
3. Update `VITE_API_ENDPOINT` to point to your endpoint

## 5. Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** on your backend
4. **Add CORS restrictions** to limit which domains can submit
5. **Validate all input** before sending to Airtable
6. **Use HTTPS** for all API communications
7. **Implement request signing** for additional security

## 6. Testing

1. Run the app locally: `npm run dev`
2. Complete the quiz
3. Check your Airtable base for new records
4. Verify data integrity in both tables

## 7. Monitoring

Consider implementing:
- Error logging (e.g., Sentry)
- Submission analytics
- Failed submission recovery
- Backup storage (localStorage fallback is included)

## Troubleshooting

### Common Issues:

1. **"Missing Airtable configuration"**
   - Ensure environment variables are set correctly
   - Check that the .env file is in the project root

2. **"Failed to submit quiz response"**
   - Verify API key has correct permissions
   - Check Base ID is correct
   - Ensure table and field names match exactly

3. **CORS errors**
   - Use the proxy server approach for production
   - Check CORS headers in your backend

4. **Rate limiting**
   - Implement request throttling
   - Consider using a queue system for high traffic