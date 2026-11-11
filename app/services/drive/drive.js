import { google } from 'googleapis';
import oauth_credentials from '../../../oauth_credentials.json' with { type: 'json' };

const oauth2Client = new google.auth.OAuth2(
    oauth_credentials.installed.client_id,
    oauth_credentials.installed.client_secret
);
oauth2Client.setCredentials({
    refresh_token: process.env.DRIVE_REFRESH_TOKEN
});
export default oauth2Client;