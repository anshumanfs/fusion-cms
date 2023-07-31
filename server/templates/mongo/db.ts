/**
 * Generates the content of a database file for the given app name.
 *
 * @param {string} appName - The name of the app.
 * @return {string} The content of the generated database file.
 */
const generateDbFile = (appName: string) => {
    const fileContent = `
    const mongoose = require('mongoose');
    const path = require('path');
    const { url, connectionOptions } = require('../config.json');
    const conn = mongoose.createConnection(url,connectionOptions);
    conn.on('connected', () => {
        console.log('✓ ${appName} :- MongoDB connected');
    });
    conn.on('error', (err) => {
        console.log('✗ ${appName} :- MongoDB connection error: \${err}\');
    })
    module.exports = conn;
    `;
    return fileContent;
}

export { generateDbFile };