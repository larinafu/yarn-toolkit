import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Yarn Toolkit protects your privacy and handles session-based data with no personal tracking.",
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-5xl mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-600">
        Effective Date: July 21st, 2025
      </p>

      <section className="mb-6">
        <p>
          Yarn Toolkit (&quot;I,&quot; &quot;my,&quot; &quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;) respects your privacy. This
          Privacy Policy explains how we handle information when you use this
          website, located at{" "}
          <a href="https://yarntoolkit.com" className="text-blue-600 underline">
            https://yarntoolkit.com
          </a>
          .
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl mb-2">1. No Personal Data Collected</h2>
        <p>
          No personally identifiable information (PII) is collected. You do not
          need to create an account or share personal details to use this site.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl mb-2">2. Temporary Session Data</h2>
        <p>
          This site uses session storage to temporarily store your chart
          configuration and preferences. This data is not saved to any server
          and is cleared once your session ends (e.g., when you close the tab or
          browser).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl mb-2">3. Image Processing</h2>
        <p>
          If you upload an image to assist in chart creation, it is processed
          temporarily in your browser and not stored or shared with anyone.
          Images are not saved or retained after your session ends.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl mb-2">4. Analytics and Hosting</h2>
        <p>
          Google Search Console and Cloudflare are used insights to understand
          general site performance (e.g., traffic volume, errors). These tools
          do not give the site owner access to individual user data.
        </p>
        <p className="mt-2">
          This site is hosted using Cloudflare Workers, which may collect
          aggregated traffic data to help us detect and prevent abuse (e.g.,
          denial of service attacks).
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl mb-2">5. Children&apos;s Privacy</h2>
        <p>
          Yarn Toolkit is not intended for children under the age of 13.
          Personal information from anyone under 13 is not knowlingly collected.
          If the site owner is alerted that such information has been provided,
          steps will be taken to delete it immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl mb-2">6. Global Access</h2>
        <p>
          Yarn Toolkit is accessible worldwide. By using the site, you
          understand that data (including session data) may be processed in the
          United States, where the hosting services are based.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-3xl mb-2">7. Future Updates</h2>
        <p>
          This Privacy Policy may be updated occasionally. Any updates will be
          posted here with a new effective date. Continued use of the site after
          changes are posted constitutes acceptance of those changes.
        </p>
      </section>

      <section>
        <h2 className="text-3xl mb-2">8. Contact</h2>
        <p>
          If you have any questions about this Privacy Policy, please reach out
          to me via email at{" "}
          <Link
            href="mailto:info@yarntoolkit.com"
            className="text-blue-600 underline"
          >
            info@yarntoolkit.com
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
