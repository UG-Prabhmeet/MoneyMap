import arcjet, { tokenBucket } from '@arcjet/next';

// Initialize Arcjet to protect the application from common threats and abuse
const aj = arcjet({
	key: process.env.ARCJET_KEY,
	characteristics: ['userId'], // Track rate limits based on the user's Clerk ID
	rules: [
		// Rate limiting: Token Bucket algorithm for controlling resource creation
		tokenBucket({
			mode: 'LIVE',
			refillRate: 10, // Add 10 "tokens" (actions allowed)
			interval: 3600, // Every 1 hour (3600 seconds)
			capacity: 10,   // Maximum burst of 10 actions at once
		}),
	],
});

export default aj;
