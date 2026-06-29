import { RetroNav } from "@/components/arcade/RetroNav";
import { Hero } from "@/components/arcade/Hero";
import { Portfolio } from "@/components/arcade/Portfolio";
import { WhatWeBuild } from "@/components/arcade/WhatWeBuild";
import { HowWeWork } from "@/components/arcade/HowWeWork";
import { ClosingCta } from "@/components/arcade/ClosingCta";
import { RetroFooter } from "@/components/arcade/RetroFooter";

export default function Home() {
  return (
    <>
      <RetroNav />
      <main>
        <Hero />
        <Portfolio />
        <WhatWeBuild />
        <HowWeWork />
        <ClosingCta />
      </main>
      <RetroFooter />
    </>
  );
}
