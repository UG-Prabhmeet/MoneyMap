'use server';

import { Resend } from 'resend';

export async function sendEmail({ to, subject, react }) {
	// Initialize Resend client with API key from environment variables
	const resend = new Resend(process.env.RESEND_API_KEY || '');

	try {
		// Send the email using the provided recipient, subject, and React component (template)
		const data = await resend.emails.send({
			from: 'Money Map <onboarding@resend.dev>', // Verified sender address in Resend
			to,
			subject,
			react,
		});

		return { success: true, data };
	} catch (error) {
		console.error('Failed to send email:', error);
		return { success: false, error };
	}
}
