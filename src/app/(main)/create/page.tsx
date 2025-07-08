import { Metadata } from "next";
import Create from "./create";

export const metadata: Metadata = {
  title: "Create Knitting Chart",
  description: "Create free knitting chart.",
};

export default function CreatePage() {
  return <Create />;
}
