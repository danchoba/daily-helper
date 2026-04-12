import { Resend } from 'resend'

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
  const resend = new Resend(process.env.RESEND_API_KEY)

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

/** Notify a worker that their verification was approved */
export async function sendVerificationApprovedEmail(params: {
  workerEmail: string
  workerName: string
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: FROM,
    to: params.workerEmail,
    subject: 'You\'ve been verified on Daily Helper',
    html: `
      <p>Hi ${params.workerName},</p>
      <p>Congratulations! Your identity has been verified and you've been awarded the <strong>Trusted badge</strong> on Daily Helper.</p>
      <p>Your profile now stands out to customers looking for reliable workers.</p>
      <p>
        <a href="${APP_URL}/dashboard/worker" style="background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
          Go to your dashboard
        </a>
      </p>
      <p style="color:#64748b;font-size:13px;">Daily Helper · Connecting Botswana</p>
    `,
  })
}

/** Notify a worker that their verification was rejected */
export async function sendVerificationRejectedEmail(params: {
  workerEmail: string
  workerName: string
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: FROM,
    to: params.workerEmail,
    subject: 'Your verification request was not approved',
    html: `
      <p>Hi ${params.workerName},</p>
      <p>Unfortunately, we were unable to verify your identity at this time. Your verification request has been rejected.</p>
      <p>You're welcome to resubmit with a clearer ID document.</p>
      <p>
        <a href="${APP_URL}/dashboard/worker/verification" style="background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
          Resubmit verification
        </a>
      </p>
      <p style="color:#64748b;font-size:13px;">Daily Helper · Connecting Botswana</p>
    `,
  })
}

/** Notify a worker that a new job matching their services has been posted */
export async function sendJobAlertEmail(params: {
  workerEmail: string
  workerName: string
  jobTitle: string
  jobId: string
  jobArea: string
  categoryName: string
  customerName: string
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: FROM,
    to: params.workerEmail,
    subject: `New ${params.categoryName} job in ${params.jobArea}`,
    html: `
      <p>Hi ${params.workerName},</p>
      <p>A new job matching your services has just been posted on Daily Helper.</p>
      <table style="border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0;width:100%">
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Job</td><td style="padding:6px 0;font-weight:600;">${params.jobTitle}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Category</td><td style="padding:6px 0;">${params.categoryName}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Location</td><td style="padding:6px 0;">${params.jobArea}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Posted by</td><td style="padding:6px 0;">${params.customerName}</td></tr>
      </table>
      <p>
        <a href="${APP_URL}/jobs/${params.jobId}" style="background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
          View and apply
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
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: FROM,
    to: params.workerEmail,
    subject: `You've been selected for "${params.jobTitle}"`,
    html: `
      <p>Hi ${params.workerName},</p>
      <p>Great news! <strong>${params.customerName}</strong> has selected you for the job <strong>${params.jobTitle}</strong>.</p>
      <p>The customer can now see your contact details and will reach out directly. You'll hear from them soon.</p>
      <p>
        <a href="${APP_URL}/dashboard/worker/applications" style="background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
          View your applications
        </a>
      </p>
      <p style="color:#64748b;font-size:13px;">Daily Helper · Connecting Botswana</p>
    `,
  })
}
