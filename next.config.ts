import type { NextConfig } from 'next';

function generateContentSecurityPolicy(config: Record<string, string[]>) {
	return Object.entries(config)
		.map(([key, values]) => `${key} ${values.join(' ')}`)
		.join('; ');
}

const cspConfig = {
	'default-src': ["'self'", "'unsafe-inline'"],
	'script-src': ["'self'", "'unsafe-inline'"], // Use nonce instead of unsafe-inline
	'style-src': ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
	'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
	'img-src': ["'self'", 'data:'],
	'frame-ancestors': ["'none'"],
	'form-action': ["'self'"],
	'base-uri': ["'self'"],
	'object-src': ["'none'"],
	'upgrade-insecure-requests': [],
};

const securityHeaders = [
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=31536000; includeSubDomains',
	},
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{
		key: 'Permissions-Policy',
		value: 'geolocation=(), microphone=(), camera=()',
	},
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
	{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
	{
		key: 'Access-Control-Allow-Origin',
		value: 'http://localhost:3000',
	},
];

const cspContent = generateContentSecurityPolicy(cspConfig);

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					...securityHeaders,
					{
						key: 'Content-Security-Policy',
						value: cspContent,
					},
				],
			},
		];
	},
};

export default nextConfig;
