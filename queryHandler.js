// const express = require('express');
// const app = express();

// const logs = []; // Replace with your actual log storage solution

// // Endpoint for querying logs
// app.get('/logs', (req, res) => {
//     const { level, message, resourceId, timestamp, traceId, spanId, commit, parentResourceId } = req.query;

//     // Implement logic to filter logs based on provided parameters
//     const filteredLogs = logs.filter(log => (
//         (!level || log.level === level) &&
//         (!message || log.message.includes(message)) &&
//         (!resourceId || log.resourceId === resourceId) &&
//         (!timestamp || log.timestamp === timestamp) &&
//         (!traceId || log.traceId === traceId) &&
//         (!spanId || log.spanId === spanId) &&
//         (!commit || log.commit === commit) &&
//         (!parentResourceId || (log.metadata && log.metadata.parentResourceId === parentResourceId))
//         // Add other filters similarly
//     ));

//     res.json(filteredLogs);
// });

// const PORT = 4000;
// app.listen(PORT, () => {
//     console.log(`Query interface running on port ${PORT}`);
// });

// queryHandler.js

function fetchLogs() {
    const levelFilter = document.getElementById('levelFilter').value;
    const messageFilter = document.getElementById('messageFilter').value;
    const resourceIdFilter = document.getElementById('resourceIdFilter').value;
    const timestampStartFilter = document.getElementById('timestampStartFilter').value;
    const timestampEndFilter = document.getElementById('timestampEndFilter').value;
    const traceIdFilter = document.getElementById('traceIdFilter').value;
    const spanIdFilter = document.getElementById('spanIdFilter').value;
    const commitFilter = document.getElementById('commitFilter').value;
    const parentResourceIdFilter = document.getElementById('parentResourceIdFilter').value;

    const queryParams = new URLSearchParams();
    if (levelFilter) queryParams.append('level', levelFilter);
    if (messageFilter) queryParams.append('message', messageFilter);
    if (resourceIdFilter) queryParams.append('resourceId', resourceIdFilter);
    if (timestampStartFilter) queryParams.append('timestampStart', timestampStartFilter);
    if (timestampEndFilter) queryParams.append('timestampEnd', timestampEndFilter);
    if (traceIdFilter) queryParams.append('traceId', traceIdFilter);
    if (spanIdFilter) queryParams.append('spanId', spanIdFilter);
    if (commitFilter) queryParams.append('commit', commitFilter);
    if (parentResourceIdFilter) queryParams.append('metadata.parentResourceId', parentResourceIdFilter);

    const queryUrl = `http://localhost:3000/logs?${queryParams}`;

    fetch(queryUrl)
        .then(response => response.json())
        .then(data => {
            displayLogs(data);
        })
        .catch(error => {
            console.error('Error fetching logs:', error);
        });
}

function displayLogs(logs) {
    const logsContainer = document.getElementById('logs');
    logsContainer.innerHTML = '';

    if (logs.length === 0) {
        logsContainer.innerHTML = '<p>No logs found.</p>';
        return;
    }

    logs.forEach((log, index) => {
        setTimeout(() => {
            const logElement = createLogElement(log);
            logsContainer.appendChild(logElement);
        }, index * 100); // Add delay for basic animation
    });
}

function createLogElement(log) {
    const logItem = document.createElement('div');
    logItem.classList.add('log-item');
    logItem.innerHTML = `
        <p><strong>Level:</strong> ${log.level}</p>
        <p><strong>Message:</strong> ${log.message}</p>
        <p><strong>Resource ID:</strong> ${log.resourceId}</p>
        <!-- Add other log details as needed -->
    `;
    return logItem;
}


