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
    <footer className="w-full p-4 bg-amaranth-light">
      <div className="w-1/2 flex flex-col sm:flex-row sm:justify-center text-center m-auto sm:w-full">
        {footerLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="text-amaranth hover:underline sm:ml-2 sm:first:ml-0"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </footer>
  );
}
