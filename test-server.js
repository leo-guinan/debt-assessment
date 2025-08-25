// Simple test to verify server runs without Express 5 issues
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/test', (req, res) => {
  res.json({ status: 'ok', express_version: express.version });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Express version: ${express.version}`);
  process.exit(0); // Exit after successful start
});