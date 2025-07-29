import Link from "next/link";

const footerLinks = [
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
  {
    title: "Privacy",
    href: "/privacy",
  },
  {
    title: "Terms and Conditions",
    href: "/terms-and-conditions",
  },
];
export default function Footer() {
  return (
    <footer className="w-full p-4 bg-amaranth-light flex flex-col sm:flex-row justify-center">
      {footerLinks.map((link) => (
        <Link
          key={link.title}
          href={link.href}
          className="text-amaranth hover:underline ml-2 first:ml-0"
        >
          {link.title}
        </Link>
      ))}
    </footer>
  );
}
