import nodemailer from "nodemailer";

export async function sendOnboardingEmail(email, token) {
	// const transporter = nodemailer.createTransport({
	// 	service: "Gmail",
	// 	port: 465,
	// 	secure: true,
	// 	auth: {
	// 		user: process.env.EMAIL_USER,
	// 		pass: process.env.EMAIL_PASS,
	// 	},
	// });

	const transporter = nodemailer.createTransport({
		host: "smtp.zoho.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

	try {
		const info = await transporter.sendMail({
			from: `"SoroBuild" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "Verify Your Email",
			html: `
				<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Welcome to SoroBuild!</h2>
     			 <p>
        			To start using SoroBuild, please click the link below to verify your email:
      			</p>
      			<p>
       				<a href="${verificationUrl}" 
           				style="display: inline-block; padding: 10px 15px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">
          				Verify Your Email
        			</a>
      			</p>
      			<p>If you didn't sign up for SoroBuild, you can ignore this email.</p>
      			<p>Thank you,<br>The SoroBuild Team</p>
                </div>

			`,
		});

		console.log(`✅ Email successfully sent to ${email}`);
		console.log(`📬 Response: ${info.response}`);
	} catch (error) {
		console.error(`❌ Failed to send email to ${email}`);
		console.error(error);
		throw error;
	}
}
