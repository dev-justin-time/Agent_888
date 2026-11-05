import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MainLayout } from "@/components/layout/MainLayout";
import { MessageCircle, MapPin, Users, Briefcase, Shield, Lightbulb } from "lucide-react";

export default function LandingPage() {
  return (
    <MainLayout>
      <section className="flex flex-col items-center text-center py-12 space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center luma-glow">
          <span className="text-primary font-bold text-2xl font-headline-md">L</span>
        </div>
        <h1 className="font-display-lg text-display-lg text-primary leading-tight">
          Welcome to LumaNation
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          A private, anonymous space to navigate heavy days, find support, connect with verified
          providers, and steward the mission forward.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/navigate">
            <Button>Start navigating</Button>
          </Link>
          <Link href="/resources">
            <Button variant="outline">Find support</Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
        <Link href="/navigate">
          <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform">
            <MessageCircle className="text-primary mb-4" size={28} />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Navigate</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Chat with Luma, a gentle guide that listens without judgment and never stores your
              words.
            </p>
          </GlassCard>
        </Link>
        <Link href="/resources">
          <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform">
            <MapPin className="text-primary mb-4" size={28} />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Resources</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Discover hotlines, grants, and community-funded support near you.
            </p>
          </GlassCard>
        </Link>
        <Link href="/community">
          <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform">
            <Users className="text-primary mb-4" size={28} />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Community</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Connect with verified professionals and sanctuaries through zero-record privacy.
            </p>
          </GlassCard>
        </Link>
        <Link href="/experts">
          <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform">
            <Lightbulb className="text-primary mb-4" size={28} />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Experts</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Plain-language logic for money, rights, career, learning, home, and digital
              safety — grounded in built-in frameworks.
            </p>
          </GlassCard>
        </Link>
        <Link href="/stewardship">
          <GlassCard className="p-6 h-full hover:-translate-y-1 transition-transform">
            <Briefcase className="text-primary mb-4" size={28} />
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Stewardship</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Generate partner outreach and transparent escrow instructions.
            </p>
          </GlassCard>
        </Link>
      </section>

      <GlassCard
        as="section"
        shape="square"
        hover={false}
        className="mt-12 flex items-start gap-4 p-6 border-l-4 border-l-primary/50"
      >
        <Shield className="text-primary flex-shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Privacy First</h4>
          <p className="font-body-md text-body-md text-on-surface-variant">
            No records are kept. No accounts required. Your session is completely anonymous.
          </p>
        </div>
      </GlassCard>
    </MainLayout>
  );
}
