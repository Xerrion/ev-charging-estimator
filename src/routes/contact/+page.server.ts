import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      const data = await request.formData();
      const name = data.get('name');
      const email = data.get('email');
      const subject = data.get('subject');
      const message = data.get('message');

      // Validate inputs
      if (!name || !email || !subject || !message) {
        return fail(400, {
          success: false,
          message: 'All fields are required',
          data: {
            name: data.get('name'),
            email: data.get('email'),
            subject: data.get('subject')
          }
        });
      }

      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(email.toString())) {
        return fail(400, {
          success: false,
          message: 'Please enter a valid email address',
          data: {
            name: data.get('name'),
            email: data.get('email'),
            subject: data.get('subject')
          }
        });
      }

      // In a real app, here you would:
      // 1. Send an email notification
      // 2. Save the message to a database
      // 3. Integrate with a CRM or ticketing system
      console.log('Contact form submission:', { name, email, subject, message });

      // For now, we'll just simulate a successful submission
      return {
        success: true,
        message: "Thank you for your message! We'll get back to you as soon as possible."
      };
    } catch (error) {
      console.error('Error processing contact form submission:', error);
      return fail(500, {
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    }
  }
};
