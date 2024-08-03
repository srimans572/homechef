import { Resend } from 'resend';
const resend = new Resend('re_M1CS65eK_CniJtZ8GpxDWT91YCfCy5DQG');

export async function POSsT () {
  try {
    const data = await resend.emails.send({
      from: 'srimans572@gmail.com',
      to: ['srimans572@gmail.com'],
      subject: 'Hello World',
      html: '<strong>It works!</strong>'
    });

    console.log(data);
  }
   catch (error) {
    console.error(error);
  }
};