import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and Conditions for Yarn Toolkit",
};

export default function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-4 text-sm text-gray-600">
        Effective Date: July 21st, 2025
      </p>

      <section className="mb-8">
        <p>
          Welcome to Yarn Toolkit! These Terms and Conditions (“Terms”) govern
          your access to and use of our website, located at
          https://yarntoolkit.com/ (“Site”), operated by an individual in New
          Jersey (“we,” “us,” or “our”). By accessing or using Yarn Toolkit, you
          agree to be bound by these Terms. If you do not agree, please do not
          use the Site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Use of the Site</h2>
        <p>
          Yarn Toolkit is provided for your personal, non-commercial use to
          assist in the creation of knitting charts. You agree to use the Site
          in accordance with these Terms and all applicable laws and
          regulations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Intellectual Property</h2>
        <p>
          All content on the Site, including text, graphics, logos, and
          software, is the property of Yarn Toolkit or its content suppliers and
          is protected by copyright and other intellectual property laws. You
          may not reproduce, distribute, or create derivative works without our
          express permission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Acceptable Use</h2>
        <p>
          You agree not to use Yarn Toolkit to upload, generate, or distribute
          any content that:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            Violates intellectual property rights by replicating another
            creator’s work without permission.
          </li>
          <li>Contains hateful, obscene, offensive, or illegal material.</li>
          <li>
            Attempts to circumvent or remove Yarn Toolkit watermarks placed on
            downloaded charts.
          </li>
        </ul>
        <p className="mt-2">
          Any such actions are a clear violation of these Terms and may result
          in restriction or termination of access to the Site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. User Uploads</h2>
        <p>
          You may upload an image to assist in generating a knitting chart.
          However, images are not stored or shared—they are processed
          temporarily and remain private to you during your session.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Commercial Use of Generated Charts
        </h2>
        <p>
          Charts created with Yarn Toolkit may be used for commercial purposes,
          provided that you retain the original Yarn Toolkit watermark included
          on the downloaded chart. Removing or altering this watermark is a
          violation of these Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Disclaimer of Warranties
        </h2>
        <p>
          Yarn Toolkit is provided “as is” and “as available.” We make no
          warranties or guarantees regarding the functionality, availability, or
          accuracy of the Site, and we disclaim all liability for any errors or
          interruptions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, Yarn Toolkit and its operator
          will not be liable for any damages arising from your use of the Site,
          including indirect or incidental damages.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Privacy</h2>
        <p>
          Please refer to our{" "}
          <a href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </a>{" "}
          for details on how we collect and use your information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Modifications</h2>
        <p>
          We may update these Terms from time to time. Changes will be posted on
          this page with an updated effective date. Your continued use of the
          Site after changes are posted constitutes your acceptance of the
          revised Terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the State of New Jersey, without regard to its conflict of law
          provisions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">11. Contact</h2>
        <p>
          If you have any questions about these Terms, please contact us via the{" "}
          <a href="/contact" className="text-blue-600 underline">
            Contact
          </a>{" "}
          page.
        </p>
      </section>
    </div>
  );
}
