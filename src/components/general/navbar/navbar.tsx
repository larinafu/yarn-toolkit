import Link from "next/link";
import Image from "next/image";

import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className="bg-amaranth p-2 text-white flex justify-between items-center text-xl">
      <div>
        <Link href="/" className="flex items-center">
          <p>yarn</p>
          <Image src={"/logo.jpg"} width={40} height={40} alt="logo" />{" "}
          <p>toolkit</p>
        </Link>
      </div>
      <div className={`${styles.center} flex bg-white rounded-2xl pl-2 pr-2 text-amaranth`}>
        <Link href="create">
          <p>create now</p>
        </Link>
      </div>
    </nav>
  );
}
