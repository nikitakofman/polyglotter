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
            Polyglotter streamlines communication across different languages. To
            use Polyglotter, simply create an account, establish a chat room,
            and invite registered friends via their email. As an admin, you have
            the authority to manage your chat room, including the ability to
            remove participants or delete the room entirely. Select your
            preferred language from our extensive list to seamlessly translate
            chat conversations.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What does Pro Membership offer?</AccordionTrigger>
          <AccordionContent>
            The Pro Membership on Polyglotter elevates your experience by
            offering unlimited chat room creation, the ability to send
            multimedia messages, and access to all available languages for
            translation, ensuring a boundless and enriched communication
            experience.
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
        <h2 className="mt-10 text-center mb-3">
          Terms of Service for Polyglotter
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
        <p className="mb-3">
          For any questions about these Terms, please contact us at
          polyglotterapp@gmail.com
        </p>
      </div>
    </div>
  );
}

export default Support;
