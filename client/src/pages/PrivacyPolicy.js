import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p>Effective Date: 21st February 2025</p>
            <p>At QAHub.Tech, we respect your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.</p>

            <h2 className="text-2xl font-semibold mt-4">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc ml-6">
                <li>Personal information (e.g., name, email, contact details)</li>
                <li>Technical data (e.g., IP address, browser type, device information)</li>
                <li>Usage data (e.g., pages visited, time spent on the site)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-4">2. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc ml-6">
                <li>To provide and improve our services</li>
                <li>To personalize user experience</li>
                <li>To send updates, newsletters, or important notifications</li>
                <li>To ensure website security and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-4">3. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to enhance user experience, analyze trends, and administer the site. You can control cookie settings in your browser.</p>

            <h2 className="text-2xl font-semibold mt-4">4. Third-Party Services</h2>
            <p>We may use third-party services for analytics, advertising, and other functionalities. These services may collect data as per their policies.</p>

            <h2 className="text-2xl font-semibold mt-4">5. Data Security</h2>
            <p>We implement appropriate security measures to protect your data from unauthorized access, alteration, or disclosure.</p>

            <h2 className="text-2xl font-semibold mt-4">6. Your Rights</h2>
            <p>You have the right to access, update, or request the deletion of your personal information. To exercise these rights, contact us.</p>

            <h2 className="text-2xl font-semibold mt-4">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>

            <h2 className="text-2xl font-semibold mt-4">8. Contact Us</h2>
            <p>If you have any questions or concerns, please contact us at [Your Email Address].</p>
        </div>
    );
};

export default PrivacyPolicy;
