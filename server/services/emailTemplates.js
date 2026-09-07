const welcomeEmail = (name) => {
    return `
        <h2>Welcome, ${name}! 🎉</h2>

        <p>
            Your Skill Exchange Platform account
            has been created successfully.
        </p>

        <p>
            Start connecting with people
            and exchanging skills.
        </p>
    `;
};


const connectionAcceptedEmail = () => {
    return `
        <h2>Connection Accepted 🤝</h2>

        <p>
            Your connection request has been accepted.
        </p>

        <p>
            You can now connect and exchange skills.
        </p>
    `;
};


const sessionScheduledEmail = (skill, mentorName, sessionDate, status) => {
    return `
        <h2>Session Scheduled 📅</h2>

        <p>
            Your learning session has been scheduled successfully.
        </p>

        <p>
            <strong>Skill:</strong> ${skill}
        </p>

        <p>
            <strong>Mentor:</strong> ${mentorName}
        </p>

        <p>
            <strong>Date:</strong> ${sessionDate}
        </p>

        <p>
            <strong>Status:</strong> ${status}
        </p>

        <p>
            We look forward to your learning session!
        </p>
    `;
};

const passwordResetEmail = (name, resetUrl) => {
    return `
        <div style="font-family: Arial, sans-serif;">
            <h2>Password Reset Request</h2>

            <p>Hello ${name},</p>

            <p>
                We received a request to reset your
                Skill Exchange Platform password.
            </p>

            <p>
                Click the button below to create a new password:
            </p>

            <a
                href="${resetUrl}"
                style="
                    display:inline-block;
                    padding:12px 20px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                "
            >
                Reset Password
            </a>

            <p>
                This link will expire in 15 minutes.
            </p>

            <p>
                If you did not request this password reset,
                you can safely ignore this email.
            </p>

            <p>
                Regards,<br>
                Skill Exchange Platform
            </p>
        </div>
    `;
};


module.exports = {
    welcomeEmail,
    connectionAcceptedEmail,
    sessionScheduledEmail,
    passwordResetEmail
};