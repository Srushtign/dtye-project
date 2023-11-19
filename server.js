const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/logDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const LogSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: Date,
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String,
  },
});

const LogModel = mongoose.model('Log', LogSchema);

app.post('/ingest', async (req, res) => {
  try {
    const newLog = await LogModel.create(req.body);
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/logs', async (req, res) => {
  try {
    const { level, message, resourceId, startTimestamp, endTimestamp, traceId, spanId, commit, parentResourceId } = req.query;

    const query = {};
    if (level) query.level = level;
    if (message) query.message = { $regex: message, $options: 'i' };
    if (resourceId) query.resourceId = resourceId;
    if (traceId) query.traceId = traceId;
    if (spanId) query.spanId = spanId;
    if (commit) query.commit = commit;
    if (parentResourceId) query['metadata.parentResourceId'] = parentResourceId;

    if (startTimestamp || endTimestamp) {
      query.timestamp = {};
      if (startTimestamp) query.timestamp.$gte = new Date(startTimestamp);
      if (endTimestamp) query.timestamp.$lte = new Date(endTimestamp);
    }

    const logs = await LogModel.find(query).exec();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Log ingestor running on port ${PORT}`);
});
