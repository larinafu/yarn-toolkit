import Link from "next/link";
export default function Footer() {
  return (
    <footer className="p-4 bg-amaranth-light flex justify-center">
      <Link href="/about" className="text-amaranth hover:underline">About</Link>
    </footer>
  );
}
