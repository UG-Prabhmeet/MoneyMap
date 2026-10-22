import arcjet, { tokenBucket, shield, detectBot } from '@arcjet/next';

// Initialize Arcjet with multi-layer defense: WAF Shield, Bot Detection, and Token Bucket
const aj = arcjet({
	key: process.env.ARCJET_KEY,
	characteristics: ['userId'], // Track rate limits based on the user's Clerk ID
	rules: [
		// 🛡️ 1. WAF Shield: Protects against common web exploits (SQLi, XSS, Path Traversal)
		shield({
			mode: 'LIVE',
		}),

		// 🤖 2. Bot Protection: Blocks malicious scrapers and automated API drain bots
		detectBot({
			mode: 'LIVE',
			allow: ['CATEGORY:SEARCH_ENGINE'], // Allow Google, Bing; block rogue scrapers
		}),

		// ⏱️ 3. Token Bucket Rate Limiting: 30 actions per minute per user (smooth refill)
		tokenBucket({
			mode: 'LIVE',
			refillRate: 30, // 30 actions
			interval: 60,   // Every 1 minute (60 seconds)
			capacity: 30,   // Maximum burst of 30 actions
		}),
	],
});

export default aj;
