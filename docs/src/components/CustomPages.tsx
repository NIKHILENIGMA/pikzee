import React from "react";

export const TeamOnboardingPage: React.FC = () => {
  return (
    <div className="team-onboarding-page">
      <h1>Team Onboarding</h1>
      <p>
        Welcome to the team! This guide will help you get up to speed quickly.
      </p>

      <h2>Onboarding Steps</h2>
      <div className="onboarding-steps">
        <div className="step">
          <h3>Week 1: Setup</h3>
          <ul>
            <li>✅ Get access to all tools</li>
            <li>✅ Set up development environment</li>
            <li>✅ Read documentation</li>
            <li>✅ Fix your first bug</li>
          </ul>
        </div>

        <div className="step">
          <h3>Week 2: Learning</h3>
          <ul>
            <li>📚 Shadow experienced developers</li>
            <li>📚 Review recent PRs</li>
            <li>📚 Understand architecture</li>
            <li>📚 Complete small tasks</li>
          </ul>
        </div>

        <div className="step">
          <h3>Week 3-4: Contributing</h3>
          <ul>
            <li>🚀 Pick up feature from backlog</li>
            <li>🚀 Submit first PR</li>
            <li>🚀 Participate in code reviews</li>
            <li>🚀 Deploy to staging</li>
          </ul>
        </div>

        <div className="resources">
          <h3>Resources</h3>
          <ul>
            <li>📖 Architecture Guide</li>
            <li>📖 API Reference</li>
            <li>📖 Coding Standards</li>
            <li>📖 Git Workflow</li>
          </ul>
        </div>
      </div>

      <h2>Key Contacts</h2>
      <ul className="key-contacts">
        <li>Tech Lead: [Name] - @techlead</li>
        <li>DevOps: [Name] - @devops</li>
        <li>Product Manager: [Name] - @pm</li>
      </ul>
      <h2>Communication Channels</h2>
      <ul className="communication-channels">
        <li>#general: Team updates and announcements</li>
        <li>#dev: Technical discussions</li>
        <li>#help: Ask questions here</li>
        <li>#deployments: Deployment notifications</li>
      </ul>
    </div>
  );
};

export default TeamOnboardingPage;
