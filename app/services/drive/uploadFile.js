import oauth2Client from './drive.js';
import { google } from 'googleapis';

export const uploadFile = async (webStream, name, mimeType) => {
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });
    await drive.files.create({
        supportsAllDrives: true,
        requestBody: {
            mimeType,
            name: name,
            parents: [process.env.SHARED_DRIVE_ID]
        },
        media: {
            mimeType,
            body: webStream
        }
    })
}