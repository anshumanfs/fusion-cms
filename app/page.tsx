// app/page.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/themeToggle';
import { CodeBlock } from '@/components/ui/codeBlock';
import { CommandCopy } from '@/components/home/CommandCopy';
import Logo from '@/components/ui/logo';
import data from './data.json';
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  ArrowRight,
  Database,
  Layout,
  Server,
  Terminal,
  Cpu,
  Globe,
} from 'lucide-react';

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const LucidReact = require('lucide-react');
  const IconElement = LucidReact[feature.icon] || Cpu;

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card/50 p-8 transition-all hover:bg-card hover:shadow-2xl hover:shadow-violet-500/10">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-violet-500/10 p-3 text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-colors">
          <IconElement className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Logo width={32} height={32} />
            <span>Fusion CMS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Documentation
            </Link>

            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Support
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Donate
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 grid-bg -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            v0.1.0 Beta is now available
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Build APIs faster than <br />
            <span className="text-gradient">you can imagine</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
            Fusion CMS is an open-source headless CMS that auto-generates powerful GraphQL and REST APIs from your
            schema definition. Connect multiple databases instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="h-12 px-8 text-lg rounded-full">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full">
              View Documentation
            </Button>
          </div>

          {/* Terminal Demo */}
          {/* Interactive Terminal */}
          <CommandCopy />

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500">
            <Terminal className="h-4 w-4" />
            <span>Works with any package manager</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg">
              Fusion CMS abstracts the complexity of backend development so you can focus on building great products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.page.Features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-violet-500 font-bold mb-4">
                    <Terminal className="h-5 w-5" />
                    <span>The Manifesto</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Building for Developers</h3>
                  <p className="text-muted-foreground mb-6">
                    &quot; We believe that backend development should be accessible, fast, and scalable without
                    sacrificing control. Fusion CMS is our answer to the repetitive boilerplate.&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <Image
                      src="https://anshumanfs.github.io/images/avatar.jpeg"
                      alt="Anshuman Nayak"
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-background"
                    />
                    <div>
                      <div className="font-bold">Anshuman Nayak</div>
                      <div className="text-xs text-muted-foreground">Creator, Fusion CMS</div>
                    </div>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-violet-600 to-blue-600 p-8 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Database className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <div className="text-2xl font-bold">Open Source</div>
                    <div className="text-white/80">MIT Licensed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Logo width={32} height={32} />
                <span>Fusion CMS</span>
              </div>
              <p className="text-muted-foreground max-w-xs mb-6">
                The open-source API development platform for modern engineering teams.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <GithubIcon className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <InstagramIcon className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <FacebookIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Legal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fusion CMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
