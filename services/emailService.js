import nodemailer from "nodemailer";

export async function sendOnboardingEmail(email, token) {
	const transporter = nodemailer.createTransport({
		service: "Gmail",
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
			subject: "Complete your registration",
			html: `
				<p>Hello,</p>
				<p>Click the link below to complete your registration:</p>
				<a href="${verificationUrl}">${verificationUrl}</a>
			`,
		});

		// ✅ Log success
		console.log(`✅ Email successfully sent to ${email}`);
		console.log(`📬 Response: ${info.response}`);
	} catch (error) {
		// ❌ Log failure
		console.error(`❌ Failed to send email to ${email}`);
		console.error(error);
		throw error;
	}
}
