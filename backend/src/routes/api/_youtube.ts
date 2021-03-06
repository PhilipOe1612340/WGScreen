import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

export class Youtube {
	SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
	TOKEN_DIR = './credentials/';
	TOKEN_PATH;

	constructor() {
		this.TOKEN_PATH = this.TOKEN_DIR + 'youtube.json';
	}

	/**
	 * Create an OAuth2 client with the given credentials, and then execute the
	 * given callback function.
	 *
	 * @param {Object} credentials The authorization client credentials.
	 * @param {function} callback The callback to call with the authorized client.
	 */
	public authorize(credentials, token) {
		credentials = JSON.parse(credentials);
		var clientSecret = credentials.installed.client_secret;
		var clientId = credentials.installed.client_id;
		var redirectUrl = credentials.installed.redirect_uris[0];
		var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

		oauth2Client.credentials = JSON.parse(token);
		return oauth2Client;
	}

	/**
	 * Lists the names and IDs of up to 10 files.
	 *
	 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
	 */
	public search(auth, query: string): any {
		return new Promise((res) => {
			var service = google.youtube('v3');

			service.search.list(
				{
					auth,
					part: 'id,snippet' as any,
					q: query,
					maxResults: 25,
					// videoSyndicated: 'true',
					type: ['video']
				},
				function (err, response) {
					if (err) {
						console.log('The API returned an error: ' + err);
						return;
					}
					res(response);
				}
			);
		});
	}
}
