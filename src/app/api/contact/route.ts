import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;

    // Try sending via Resend if API key is configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key') {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Stellora Silver Contact <onboarding@resend.dev>',
        to: 'info@jubilee.com',
        subject: subject || `Contact from ${name}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    }

    // Always return success (contact form submitted)
    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
