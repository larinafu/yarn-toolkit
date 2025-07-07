import ScreenDemo from "@/components/general/screenDemo/screenDemo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Yarn Toolkit is the essential digital workspace for fiber artists, offering powerful tools to design knitting charts with ease. Create, edit, and convert patterns effortlessly using our intuitive web-based platform.",
};

export default function Page({}) {
  return (
    <div className="w-5/6 lg:w-1/2 m-auto">
      <section>
        <h1 className="text-5xl mb-2 mt-10">Mission</h1>
        <p className="text-2xl mb-4">
          Originally created to provide knitters with a robust editing platform
          for crafting intricate patterns and detailed knitting charts, our
          mission has grown to become the essential digital workspace for all
          needlework creators—whether your passion lies in knitting, crochet,
          cross-stitch, or any other thread-based craft. We envision Yarn
          Toolkit as a virtual extension of your hands, where creativity flows
          without friction and technical limitations never hold you back. Much
          like a trusted toolkit that a skilled craftsperson relies on to
          construct complex, beautiful works, Yarn Toolkit was created to
          simplify the planning and design process so that more time can be
          spent making. We aim to remove the barriers of repetitive manual
          charting and confusing symbol placement, making the journey from idea
          to finished project as smooth, intuitive, and enjoyable as possible.
          With Yarn Toolkit, you're not just designing—you're crafting with
          confidence and freedom.
        </p>
        <div className="h-1/2 m-auto">
          <ScreenDemo />
        </div>
        <p className="text-2xl mb-10">
          Much like a trusted toolkit that a skilled craftsperson relies on to
          construct complex, beautiful works, Yarn Toolkit was created to
          simplify the planning and design process so that more time can be
          spent making. We aim to remove the barriers of repetitive manual
          charting and confusing symbol placement, making the journey from idea
          to finished project as smooth, intuitive, and enjoyable as possible.
          With Yarn Toolkit, you're not just designing—you're crafting with
          confidence and freedom.
        </p>
      </section>
      <section>
        <h1 className="text-5xl mb-2">Services</h1>
        <p className="text-2xl mb-4">
          Yarn Toolkit offers a suite of user-friendly tools tailored
          specifically to the needs of fiber artists. At its core is a powerful,
          web-based editing interface that lets users create visually rich
          knitting charts using familiar symbols and a customizable color
          palette. The intuitive drawing tools make it easy to place stitches,
          change colors, and shape your designs row by row, all within a
          structured grid format that mirrors how patterns are typically read
          and followed. Finished patterns can then be downloaded as a PNG.
        </p>
        <p className="text-2xl mb-10">
          For those who prefer visual inspiration, Yarn Toolkit also includes an
          image-to-chart converter. This feature allows users to upload an
          image—such as a logo, photo, or drawing—which is then automatically
          pixelated and translated into a color chart. From there, users can
          fine-tune the design manually using the editor. This fusion of
          automation and customizability helps bridge the gap between
          inspiration and execution, empowering crafters to bring even the most
          complex ideas to life with greater ease.
        </p>
      </section>
      <section>
        <h1 className="text-5xl mb-2">This is Just the Beginning!</h1>
        <p className="text-2xl mb-10">
          As the platform evolves, Yarn Toolkit plans to expand its offerings to
          include support for other crafts like crochet and cross-stitch.
          Whether you're designing for yourself, teaching others, or publishing
          professional patterns, Yarn Toolkit is here to help you create without
          compromise.
        </p>
      </section>
    </div>
  );
}
