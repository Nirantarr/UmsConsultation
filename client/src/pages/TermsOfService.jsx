import React from 'react';
import LegalPage from '../components/LegalPage';

const TermsOfService = () => {
  const summaryPoints = [
    "This is a binding contract. By using our site or services, you agree to these terms.",
    "You are responsible for your account's security and for all activity that occurs under it.",
    "We own our platform and content; you own yours. You grant us the rights needed to provide our services to you.",
    "Specifics for consultancy work (fees, scope, etc.) will be detailed in a separate formal agreement (MSA).",
    "We can modify these terms, and we will notify you of any significant changes."
  ];

  return (
    <LegalPage 
      title="Terms of Service" 
      effectiveDate="August 1, 2025"
      summaryPoints={summaryPoints}
    >
      <h3>1. Agreement to Terms</h3>
      <p>
        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity and <strong>UniConsult Solutions Ltd.</strong> , concerning your access to and use of the https://uniconsult.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site” and our “Services”). You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. <strong>IF YOU DO NOT AGREE WITH ALL OF THESE TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.</strong>
      </p>

      <h3>2. Our Services & Scope of Work</h3>
      <p>
        UniConsult provides Learning Management System (LMS) consultancy, implementation, support, and custom development services (“Consultancy Services”). While the Site provides information about these services, the specific scope, timelines, deliverables, and fees for any Consultancy Services will be governed by a separate Master Services Agreement (“MSA”) or Statement of Work (“SOW”) executed between you and the Company. These Terms govern your use of the Site and general interaction with our platform, while the MSA/SOW governs the specific project engagement.
      </p>

      <h3>3. User Accounts and Responsibilities</h3>
      <p>
        You may be required to register an account with the Site to access certain features. You agree to keep your password confidential and will be responsible for all use of your account and password. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. You must provide information that is accurate, complete, and current at all times.
      </p>

      <h3>4. Intellectual Property Rights</h3>
      <p>
        Unless otherwise indicated, the Site and our Services are our proprietary property. All source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us. You are granted a limited license to access and use the Site.
      </p>
      <p>
        Any data, information, or content you upload or provide to us (”Your Content”) remains your property. However, you grant us a worldwide, royalty-free license to use, reproduce, and modify Your Content as necessary to provide the Services to you.
      </p>

      <h3>5. Fees and Payment</h3>
      <p>
        Fees for our Consultancy Services will be defined in the applicable MSA or SOW. Unless otherwise stated, all fees are quoted in U.S. Dollars. You agree to provide current, complete, and accurate purchase and account information for all purchases made. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. We may change prices at any time. All payments shall be in U.S. dollars.
      </p>

      <h3>6. Confidentiality</h3>
      <p>
        "Confidential Information" means any information disclosed by one party to the other, which is marked as confidential or would reasonably be considered confidential, including but not limited to business strategies, client lists, and technical data. Both parties agree not to disclose the other's Confidential Information to any third party and to use it only for the purpose of fulfilling the obligations under the MSA. This obligation of confidentiality will survive the termination of our engagement.
      </p>

      <h3>7. Term and Termination</h3>
      <p>
        These Terms of Service shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE AND OUR SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON, INCLUDING FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OR OF ANY APPLICABLE LAW.
      </p>

      <h3>8. Disclaimers and Limitation of Liability</h3>
      <p>
        THE SITE AND OUR SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF.
      </p>
      <p>
        IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES.
      </p>

      <h3>9. Governing Law</h3>
      <p>
        These Terms and your use of the Site are governed by and construed in accordance with the laws of the State of [Your State, e.g., Delaware] applicable to agreements made and to be entirely performed within the State of [Your State], without regard to its conflict of law principles.
      </p>

      <h3>10. Contact Us</h3>
      <p>
        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at [Your Contact Email, e.g., legal@uniconsult.com].
      </p>
    </LegalPage>
  );
};

export default TermsOfService;