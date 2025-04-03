import type { NextConfig } from 'next';

function generateContentSecurityPolicy(config: Record<string, string[]>) {
	return Object.entries(config)
		.map(([key, values]) => `${key} ${values.join(' ')}`)
		.join('; ');
}

const cspConfig = {
	'default-src': ["'self'"],
	'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"], // Use nonce instead of unsafe-inline
	'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
	'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
	'img-src': ["'self'", 'data:', 'blob:'],
	'connect-src': ["'self'"],
	'frame-ancestors': ["'none'"],
	'form-action': ["'self'"],
	'base-uri': ["'self'"],
	'object-src': ["'none'"],
	'upgrade-insecure-requests': [],
	'media-src': ["'self'"],
	'worker-src': ["'self'", 'blob:'],
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
		value: 'https://richtext-eta.vercel.app',
	},
	{
		key: 'Cache-Control',
		value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
	},
	{
		key: 'Pragma',
		value: 'no-cache',
	},
	{
		key: 'Expires',
		value: '0',
	},
];

const cspContent = generateContentSecurityPolicy(cspConfig);

const nextConfig: NextConfig = {
	productionBrowserSourceMaps: false,
	optimization: {
		minimize: true,
	},
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			config.optimization.minimize = true;
		}
		return config;
	},
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
			{
				// Add cache headers for static files
				source: '/_next/static/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		];
	},
};

export default nextConfig;
