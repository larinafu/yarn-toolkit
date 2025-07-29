import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Yarn Toolkit by email.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-5xl mb-6">Contact Us</h1>
      <p className="text-lg mb-4">
        Have questions, suggestions, or feedback about Yarn Toolkit?
      </p>
      <p className="text-lg">
        Feel free to reach out by email at{" "}
        <Link
          href="mailto:info@yarntoolkit.com"
          className="text-blue-600 underline"
        >
          info@yarntoolkit.com
        </Link>
        .
      </p>
    </div>
  );
}
