import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

function Support() {
  return (
    <div className="m-10">
      <h2 className="text-2xl mb-3 font-semibold leading-7  text-[#EF9351]">
        Support
      </h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How does Polyglotter work?</AccordionTrigger>
          <AccordionContent>
            To use Polyglotter, simply create an account, establish a chat room,
            and invite registered friends via their email. As an admin, you have
            the authority to manage your chat room, including the ability to
            remove participants or delete the room entirely. Select your
            preferred language from our extensive list to translate chat
            conversations.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What does Pro Membership offer?</AccordionTrigger>
          <AccordionContent>
            The Pro Membership on Polyglotter elevates your experience by
            offering unlimited chat room creation, the ability to send
            multimedia messages, invite more then 2 other members in your chat
            and access to all available languages for translation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            Is there a refund on Pro Membership?
          </AccordionTrigger>
          <AccordionContent>
            Yes, we value customer satisfaction. Pro Membership comes with a
            14-day refund policy. If you are not completely satisfied, please
            contact us at polyglotterapp@gmail.com with your email address and
            refund request within 14 days of your purchase for a full refund.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Insert Terms of Service Here */}
      <div className="leading-8">
        <h2 className="mt-10 text-center font-bold text-2xl mb-3">
          Terms of Service
        </h2>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          1. Acceptance of Terms
        </h3>
        <p className="mb-3">
          Welcome to Polyglotter! By accessing or using our website and
          services, you agree to be bound by these Terms of Service
          (&quot;Terms&quot;). If you do not agree to these Terms, please do not
          use our services.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          2. Description of Service
        </h3>
        <p className="mb-3">
          Polyglotter provides live chat translation services, allowing users to
          create chat rooms and have conversations instantly translated into
          various languages. Users can subscribe to a Pro Membership for access
          to additional languages and the ability to create an unlimited number
          of chat rooms.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          3. User Accounts
        </h3>
        <p className="mb-3">
          <strong>Account Creation:</strong> Users must register and create an
          account to access certain features of the service.
        </p>
        <p className="mb-3">
          <strong>Account Responsibility:</strong> You are responsible for
          maintaining the confidentiality of your account and password and for
          all activities that occur under your account.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          4. Pro Membership
        </h3>
        <p className="mb-3">
          <strong>Fees:</strong> Pro Membership requires payment of a fee, as
          detailed on our website.
        </p>
        <p className="mb-3">
          <strong>Cancellation and Refund:</strong> 14 days after date of
          purchase, contact us at polyglotterapp@gmail.com if you wish to demand
          a refund.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          5. User Conduct
        </h3>
        <p className="mb-3">
          Users must not use our services to transmit any illegal, harmful,
          threatening, abusive, harassing, defamatory, vulgar, obscene, or
          otherwise objectionable material.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          6. Intellectual Property Rights
        </h3>
        <p className="mb-3">
          All content provided on Polyglotter, including but not limited to
          text, graphics, logos, and software, is the property of Polyglotter or
          its suppliers and protected by copyright and other laws.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          7. Privacy Policy
        </h3>
        <p className="mb-3">
          Your use of Polyglotter is also governed by our Privacy Policy, which
          outlines how we collect, use, and protect your personal information.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          8. Limitation of Liability
        </h3>
        <p className="mb-3">
          Polyglotter shall not be liable for any indirect, incidental, special,
          consequential or punitive damages resulting from the use or inability
          to use our services.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          9. Indemnification
        </h3>
        <p className="mb-3">
          You agree to indemnify and hold Polyglotter and its affiliates,
          officers, agents, and employees harmless from any claim or demand made
          by any third party due to or arising out of your use of the Service.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          10. Modifications to Terms
        </h3>
        <p className="mb-3">
          Polyglotter reserves the right to modify these Terms at any time. Your
          continued use of the Service following such changes will constitute
          your acceptance of the new Terms.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          11. Governing Law
        </h3>
        <p className="mb-3">
          These Terms shall be governed by and construed in accordance with the
          laws of France.
        </p>
        <h3 className="font-bold mb-3 underline underline-offset-4">
          12. Contact Us
        </h3>
        <p className="mb-5">
          For any questions about these Terms, please contact us at
          polyglotterapp@gmail.com
        </p>
        <hr className="dark:border-t-white border-t-gray-400" />
        <h2 className="mt-5 text-center font-bold text-2xl mb-3">
          Privacy policy
        </h2>

        <p className="mb-3">
          Polyglotter operates the www.polyglotter.app website, which provides
          the SERVICE.
        </p>

        <p className="mb-3">
          This page is used to inform website visitors regarding our policies
          with the collection, use, and disclosure of Personal Information if
          anyone decided to use our Service, the Polyglotter website.
        </p>

        <p className="mb-3">
          If you choose to use our Service, then you agree to the collection and
          use of information in relation with this policy. The Personal
          Information that we collect are used for providing and improving the
          Service. We will not use or share your information with anyone except
          as described in this Privacy Policy.
        </p>

        <p className="mb-3">
          The terms used in this Privacy Policy have the same meanings as in our
          Terms and Conditions, which is accessible at www.polyglotter.app,
          unless otherwise defined in this Privacy Policy.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          1. Information Collection and Use
        </h2>

        <p className="mb-3">
          For a better experience while using our Service, we may require you to
          provide us with certain personally identifiable information, including
          but not limited to your name, phone number, and postal address. The
          information that we collect will be used to contact or identify you.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          2. Log Data
        </h2>

        <p className="mb-3">
          We want to inform you that whenever you visit our Service, we collect
          information that your browser sends to us that is called Log Data.
          This Log Data may include information such as your computer&apos;s
          Internet Protocol (&quot;IP&quot;) address, browser version, pages of
          our Service that you visit, the time and date of your visit, the time
          spent on those pages, and other statistics.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          3. Service Providers
        </h2>

        <p className="mb-3">
          We may employ third-party companies and individuals due to the
          following reasons:
        </p>

        <ul>
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>

        <p className="mb-3">
          We want to inform our Service users that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          4. Security
        </h2>

        <p className="mb-3">
          {" "}
          We value your trust in providing us your Personal Information, thus we
          are striving to use commercially acceptable means of protecting it.
          But remember that no method of transmission over the internet, or
          method of electronic storage is 100% secure and reliable, and we
          cannot guarantee its absolute security.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          5. Links to Other Sites
        </h2>

        <p className="mb-3">
          Our Service may contain links to other sites. If you click on a
          third-party link, you will be directed to that site. Note that these
          external sites are not operated by us. Therefore, we strongly advise
          you to review the Privacy Policy of these websites. We have no control
          over, and assume no responsibility for the content, privacy policies,
          or practices of any third-party sites or services.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          6. Children&apos;s Privacy
        </h2>

        <p className="mb-3">
          Our Services do not address anyone under the age of 13. We do not
          knowingly collect personal identifiable information from children
          under 13. In the case we discover that a child under 13 has provided
          us with personal information, we immediately delete this from our
          servers. If you are a parent or guardian and you are aware that your
          child has provided us with personal information, please contact us so
          that we will be able to do necessary actions.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          7. Changes to This Privacy Policy
        </h2>

        <p className="mb-3">
          We may update our Privacy Policy from time to time. Thus, we advise
          you to review this page periodically for any changes. We will notify
          you of any changes by posting the new Privacy Policy on this page.
          These changes are effective immediately, after they are posted on this
          page.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          8. Cookies
        </h2>

        <p className="mb-3">
          Cookies are files with small amount of data that is commonly used an
          anonymous unique identifier. These are sent to your browser from the
          website that you visit and are stored on your computer&apos;s hard
          drive.
        </p>

        <p className="mb-3">
          Our website uses these &quot;cookies&quot; to collection information
          and to improve our Service. You have the option to either accept or
          refuse these cookies, and know when a cookie is being sent to your
          computer. If you choose to refuse our cookies, you may not be able to
          use some portions of our Service.
        </p>

        <h2 className="font-bold mb-3 underline underline-offset-4">
          9. Contact Us
        </h2>

        <p className="mb-3">
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us.
        </p>
      </div>
    </div>
  );
}

export default Support;
