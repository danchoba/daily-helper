import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Daily Helper <noreply@dailyhelper.bw>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

/** Notify a customer that a worker has applied to their job */
export async function sendNewApplicationEmail(params: {
  customerEmail: string
  customerName: string
  jobTitle: string
  jobId: string
  workerName: string
}) {
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: FROM,
    to: params.customerEmail,
    subject: `New applicant for "${params.jobTitle}"`,
    html: `
      <p>Hi ${params.customerName},</p>
      <p><strong>${params.workerName}</strong> has applied to your job <strong>${params.jobTitle}</strong>.</p>
      <p>
        <a href="${APP_URL}/dashboard/customer/jobs/${params.jobId}" style="background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
          Review applicants
        </a>
      </p>
      <p style="color:#64748b;font-size:13px;">Daily Helper · Connecting Botswana</p>
    `,
  })
}

/** Notify a worker that they have been selected for a job */
export async function sendApplicationSelectedEmail(params: {
  workerEmail: string
  workerName: string
  jobTitle: string
  jobId: string
  customerName: string
}) {
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
    from: FROM,
    to: params.workerEmail,
    subject: `You've been selected for "${params.jobTitle}"`,
    html: `
      <p>Hi ${params.workerName},</p>
      <p>Great news! <strong>${params.customerName}</strong> has selected you for the job <strong>${params.jobTitle}</strong>.</p>
      <p>The customer will now arrange payment to unlock your contact details. You'll hear from them soon.</p>
      <p>
        <a href="${APP_URL}/dashboard/worker/applications" style="background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
          View your applications
        </a>
      </p>
      <p style="color:#64748b;font-size:13px;">Daily Helper · Connecting Botswana</p>
    `,
  })
}
