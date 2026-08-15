import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { StatsStrip } from "@/components/site/stats-strip";
import { About } from "@/components/site/about";
import { Services } from "@/components/site/services";
import { Fleet } from "@/components/site/fleet";
import { Differentials } from "@/components/site/differentials";
import { Coverage } from "@/components/site/coverage";
import { Contact } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/site-footer";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { StructuredData } from "@/components/site/structured-data";

export default function Home() {
  return (
    <>
      <StructuredData />
      <SiteHeader />

      <main>
        <Hero />
        <StatsStrip />
        <About />
        <Services />
        <Fleet />
        <Differentials />
        <Coverage />
        <Contact />
      </main>

      <SiteFooter />
      <WhatsappFloat />
    </>
  );
}
