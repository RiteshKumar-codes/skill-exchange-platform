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


module.exports = {
    welcomeEmail,
    connectionAcceptedEmail,
    sessionScheduledEmail
};