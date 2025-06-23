import Link from "next/link";

const headerStyle = "p-10 text-4xl";
const bannerStyle = "h-100";
const demoBtnStyle = "button block w-fit m-5";

export default function Home() {
  return (
    <>
      <div className={`${bannerStyle}`}>
        <div className={headerStyle}>
          <h1>
            Create patterns for knitting, crochet, and cross stitch
            effortlessly.
          </h1>
          <Link href="create" className={demoBtnStyle}>
            generate now
          </Link>
        </div>
      </div>
      <div className={`${bannerStyle}`}>
        <div className={headerStyle}>
          <h1>
            Convert images into color charts.
          </h1>
        </div>
      </div>
      <div className={`${bannerStyle}`}>
        <div className={headerStyle}>
          <h1>Resources for knitters and crocheters</h1>
          <Link href="create" className={demoBtnStyle}>
            generate now
          </Link>
        </div>
      </div>
    </>
  );
}
