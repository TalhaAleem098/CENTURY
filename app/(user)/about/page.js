import dynamic from "next/dynamic";

export const metadata = {
  title: "About Us - Century Fashion Store",
  description:
    "Learn about Century, your trusted premium fashion marketplace. Discover our journey, mission, values, and dedication to excellence.",
  keywords:
    "Century, fashion, about us, premium clothing, our story, values, team",
};

const AboutClient = dynamic(() => import("./AboutClient"));

export default function AboutPage() {
  return <AboutClient />;
}
