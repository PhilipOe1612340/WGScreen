import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
import type { Handle } from '@sveltejs/kit';
import { pin } from './helpers/env';

const allowedPaths = ['/login', '/api/testpin', '/upload', '/api/proxy/images'];

export const handle: Handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');

	if (cookies.pin !== pin && !allowedPaths.includes(request.path)) {
		const referer = request.headers.referer ?? '';
		const withSlash = referer.endsWith('/');
		return {
			status: 302,
			headers: {
				Location: referer + (withSlash ? '' : '/') + 'login'
			}
		};
	}

	request.locals.userid = cookies.userid || uuid();
	const response = await resolve(request);

	if (!cookies.userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers['set-cookie'] = `userid=${request.locals.userid}; Path=/; HttpOnly`;
	}

	return response;
};
