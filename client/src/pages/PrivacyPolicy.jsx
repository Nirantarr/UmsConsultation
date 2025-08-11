import React from 'react';
import LegalPage from '../components/LegalPage';

const PrivacyPolicy = () => {
  const summaryPoints = [
    "We collect personal data you provide (e.g., name, email for demos) and technical data automatically (e.g., IP address, browser type).",
    "We use your information to operate the website, provide our services, communicate with you, and improve our offerings.",
    "We use cookies for functionality and analytics. You can control these through your browser settings.",
    "We do NOT sell your data. We only share it with trusted partners for essential services (like payment processing) or if legally required.",
    "We retain your data only as long as necessary and take strong measures to keep it secure.",
    "You have rights over your data, including the right to access, correct, or delete it."
  ];
  
  return (
    <LegalPage 
      title="Privacy Policy" 
      effectiveDate="August 1, 2025"
      summaryPoints={summaryPoints}
    >
      <h3>1. Introduction</h3>
      <p>
        UniConsult Solutions Ltd. is committed to protecting your privacy. This Privacy Policy details how we collect, use, process, and safeguard your information when you visit our website, use our dashboards, or engage with our services (collectively, the "Services"). By using our Services, you agree to the collection and use of information in accordance with this policy.
      </p>
      
      <h3>2. Information We Collect</h3>
      <p>We collect information that you provide directly to us, information we collect automatically, and information we may receive from third parties.</p>
      
      <h4>Personal Data You Provide</h4>
      <p>
        This includes personally identifiable information you voluntarily give to us when you perform actions such as registering for an account, requesting a demo, filling out a contact form, or communicating with our support team. This may include your name, email address, phone number, job title, and university or company affiliation.
      </p>

      <h4>Automatically Collected Data</h4>
      <p>
        When you use our Services, we automatically collect certain information. This "Derivative Data" may include your IP address, browser type, device information, operating system, access times, and the pages you have viewed.
      </p>

      <h4>Cookies and Tracking Technologies</h4>
      <p>
        We use cookies, web beacons, tracking pixels, and other tracking technologies to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
      </p>

      <h3>3. How We Use Your Information</h3>
      <p>We use the information we collect for various business purposes, including to:</p>
      <ul>
        <li>Provide, operate, and maintain our Services.</li>
        <li>Create and manage your account and send administrative information.</li>
        <li>Process transactions and send you related information, including invoices.</li>
        <li>Respond to your comments, questions, and provide customer service.</li>
        <li>Monitor and analyze trends, usage, and activities in connection with our Services to improve them.</li>
        <li>Detect and prevent fraudulent transactions and other illegal activities and protect the rights and property of the Company and others.</li>
        <li>With your consent, send you marketing and promotional communications.</li>
      </ul>

      <h3>4. Disclosure of Your Information</h3>
      <p>We do not sell your Personal Data. We may share information we have collected about you in certain situations:</p>
      <ul>
        <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services for us, such as payment processing (e.g., Stripe) and data analytics (e.g., Google Analytics).</li>
        <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
        <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
      </ul>

      <h3>5. Data Retention</h3>
      <p>
        We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
      </p>

      <h3>6. International Data Transfers</h3>
      <p>
        Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
      </p>

      <h3>7. Security of Your Information</h3>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
      </p>

      <h3>8. Your Privacy Rights (GDPR/CCPA)</h3>
      <p>
        Depending on your location, you may have rights under data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. To make such a request, please use the contact details provided below.
      </p>
      
      <h3>9. Contact Us</h3>
      <p>
        If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer (DPO) at: <strong>[Your Contact Email, e.g., privacy@uniconsult.com]</strong>. Please use the subject line "Privacy Inquiry" to help us direct your request appropriately.
      </p>
    </LegalPage>
  );
};

export default PrivacyPolicy;