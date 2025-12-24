import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verifikasi Email Anda - InTO UGM 2026',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="text-align: center;">Selamat Datang di InTO UGM 2026!</h1>
        <p>Halo,</p>
        <p>Terima kasih telah mendaftar di website kami. Untuk mulai menggunakan akun Anda, silakan verifikasi alamat email Anda dengan mengklik tombol di bawah ini:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" 
            style="text-decoration: none; padding: 10px 20px; color: #fff; background-color: #CB5FE9; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verifikasi Email
          </a>
        </div>
        <p>Jika tombol di atas tidak berfungsi, salin dan tempelkan tautan di bawah ini ke browser Anda:</p>
        <p style="word-wrap: break-word;">${verificationUrl}</p>
        <p>Jika Anda tidak meminta ini, abaikan email ini.</p>
        <p>Salam hangat,</p>
        <p><strong>Tim InTO UGM 2026</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      </div>
    `,
    text: `
      Selamat Datang di InTO UGM 2026!

      Halo,

      Terima kasih telah mendaftar di website kami. Untuk mulai menggunakan akun Anda, silakan verifikasi alamat email Anda dengan mengklik tautan di bawah ini:
      ${verificationUrl}

      Jika Anda tidak meminta ini, abaikan email ini.

      Salam hangat,
      InTO UGM 2026
    `,
  });
}

export async function sendHtmlEmail(email, html, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Pendaftaran Tryout InTO UGM 2026',
    html: html,
    text: text
  })
}