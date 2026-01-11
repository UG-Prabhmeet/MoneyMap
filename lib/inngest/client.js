import { Inngest } from 'inngest';

// Initialize the Inngest client for managing background jobs and workflows
export const inngest = new Inngest({
	id: 'Money-Map', 
	name: 'Money-Map',
	// Global retry strategy for all functions
	retryFunction: async (attempt) => ({
		delay: Math.pow(2, attempt) * 1000,  // exponential backoff
		maxAttempts: 2, 
	}),
});
