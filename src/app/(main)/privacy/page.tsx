import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Yarn Toolkit",
  description:
    "Learn how Yarn Toolkit handles your data, including analytics, contact form submissions, and image uploads.",
};

export default function Policy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-sm text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy describes how Yarn Toolkit ("we", "us", or "our")
        collects, uses, and protects your information when you use our website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Information We Collect
      </h2>
      <p className="mb-4">
        We collect limited information through:
        <ul className="list-disc ml-6 mt-2">
          <li>Google Search Console (e.g., traffic data, search queries)</li>
          <li>
            Cloudflare (e.g., IP addresses, device/browser info for security)
          </li>
          <li>Contact Us form (if you choose to submit your email)</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">
        We use the collected information to:
        <ul className="list-disc ml-6 mt-2">
          <li>Understand how users interact with the site</li>
          <li>Improve site functionality and performance</li>
          <li>Respond to inquiries submitted via the Contact Us form</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Email Submissions</h2>
      <p className="mb-4">
        If you submit your email through the Contact Us form, it is only used to
        reply to your inquiry. Your email is not shared or stored beyond our
        email inbox.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Sharing</h2>
      <p className="mb-4">
        We do not sell, rent, or share your personal data with third parties.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Cookies</h2>
      <p className="mb-4">
        We do not use cookies directly. However, Cloudflare may use cookies for
        security and analytics.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Image Uploads</h2>
      <p className="mb-4">
        Images uploaded to help generate knitting charts are processed locally
        and not saved or stored.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        7. Data Access and Removal
      </h2>
      <p className="mb-4">
        You may request a copy of or deletion of your submitted information by
        contacting us via the <Link href="/contact">Contact Us</Link> page.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Children's Privacy</h2>
      <p className="mb-4">
        This website is not intended for children under 13. We do not knowingly
        collect information from children.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        9. Hosting and Security
      </h2>
      <p className="mb-4">
        This site is hosted on Cloudflare Workers and benefits from Cloudflare's
        security protections.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">10. Updates</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Updates will be posted
        on this page.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">11. Contact</h2>
      <p className="mb-4">
        If you have any questions or concerns about this policy, please contact
        us via the <Link href="/contact">Contact Us</Link> page.
      </p>
    </div>
  );
}
