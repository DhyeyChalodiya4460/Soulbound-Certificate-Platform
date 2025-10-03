// Express backend for certificate metadata and IPFS pinning
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Web3Storage, File } = require('web3.storage');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN;

function getAccessToken() {
  return WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  if (!getAccessToken()) {
    throw new Error('WEB3STORAGE_TOKEN missing: set it in backend/.env');
  }
  return new Web3Storage({ token: getAccessToken() });
}

// Pin certificate metadata JSON to IPFS
app.post('/api/pin', async (req, res) => {
  try {
    const metadata = req.body;
    const file = new File([JSON.stringify(metadata)], 'metadata.json', { type: 'application/json' });
    const client = makeStorageClient();
    const cid = await client.put([file]);
    res.json({ uri: `ipfs://${cid}/metadata.json` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example endpoint for demo
app.get('/api/example', (req, res) => {
  res.json(require('../contracts/sample_metadata.json'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
