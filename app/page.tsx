'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/themeToggle';
import { CodeBlock } from '@/components/ui/codeBlock';
import Logo from '@/components/ui/logo';
import data from './data.json';
import { FacebookIcon, GithubIcon } from 'lucide-react';
import { InstagramLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons';

function Feature() {
  const LucidReact = require('lucide-react');
  return data.page.Features.map((feature, index) => {
    const IconElement = LucidReact[feature.icon];
    return (
      <a
        className="block rounded-xl p-8 shadow-xl transition hover:shadow-violet-500/50"
        href="/services/digital-campaigns"
        key={`Feature-page-${index}`}
      >
        <IconElement className="h-6 w-6 text-violet-500" />

        <h2 className="mt-4 text-xl font-bold">{feature.title}</h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{feature.description}</p>
      </a>
    );
  });
}

export default function Home() {
  return (
    <>
      <section id="Page-Header">
        <header className="body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a className="flex title-font font-medium items-center mb-4 md:mb-0">
              <Logo width={50} height={50} />
              <span className="ml-3 text-xl">Fusion CMS</span>
            </a>
            <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              <a className="mr-5 hover:text-gray-500 cursor-pointer">Documentation</a>
              <a className="mr-5 hover:text-gray-500 cursor-pointer">Support</a>
              <a className="mr-5 hover:text-gray-500 cursor-pointer">Donate</a>
            </nav>
            <ModeToggle />
          </div>
        </header>

        <div className="container mx-auto flex px-5 pt-24 items-center justify-center flex-col">
          <span className="text-5xl font-medium">Don&apos;t waste effort in building APIs</span>
          <span className="m-4 text-gray-500 text-2xl">Define your schema and expose apis in minutes</span>
        </div>
        <div className="container mx-auto flex px-5 pt-24 items-center justify-center flex-col">
          <div className="mb-4 mt-12 inline-flex flex-col items-center space-x-0 space-y-4 text-center sm:flex-row sm:space-x-4 sm:space-y-0">
            {data.page.commands.map((command, index) => {
              return (
                <>
                  <CodeBlock command={`${command} fusion-cms`} key={`CodeBlock-Page-${index}`}>
                    <span className="flex-1">
                      <span className="dark:text-white text-slate-800">{command}</span>
                      <span className="dark:text-yellow-500 text-violet-700 ml-2">fusion-cms</span>
                    </span>
                  </CodeBlock>
                  {index !== data.page.commands.length - 1 && (
                    <span className="bg-slate-800 dark:bg-white  hidden h-5 w-px md:inline-flex"></span>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </section>
      <section id="Page-Features">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Kickstart your API Journey</h2>

            <p className="mt-4 text-gray-500 dark:text-gray-300">
              Get started with Fusion CMS in minutes. Fusion CMS is a headless CMS that provides everything you need to
              build powerful GraphQL and RESTful APIs.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Feature />
          </div>

          <div className="mt-12 text-center">
            <Button variant="default" size="lg">
              Get started
            </Button>
          </div>
        </div>
      </section>
      <section id="Page-Manifesto">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Our Manifesto</h2>
          </div>
        </div>
      </section>
      <section id="Page-Footer">
        <footer>
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-start lg:gap-8">
              <div className="text-teal-600">
                <Logo width={100} height={100} />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16">
                <div className="col-span-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get the latest news!</h2>

                    <p className="mt-4 text-gray-500">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse non cupiditate quae nam molestias.
                    </p>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-3 lg:flex lg:items-end">
                  <form className="w-full">
                    <div className="flex w-full max-w-sm space-x-2 float-right">
                      <Input type="email" className="w-[100%]" placeholder="Email" />
                      <Button type="submit">Subscribe</Button>
                    </div>
                  </form>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-medium text-gray-900 dark:text-white">Services</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        1on1 Coaching{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Company Review{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Accounts Review{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        HR Consulting{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        SEO Optimisation{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-medium text-gray-900 dark:text-white">Company</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        About{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Meet the Team{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Accounts Review{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-medium text-gray-900 dark:text-white">Helpful Links</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Contact{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        FAQs{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Live Chat{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-medium text-gray-900 dark:text-white">Legal</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Accessibility{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Returns Policy{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Refund Policy{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Hiring Statistics{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="font-medium text-gray-900 dark:text-white">Downloads</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        Marketing Calendar{' '}
                      </a>
                    </li>

                    <li>
                      <a href="#" className="text-gray-700 transition hover:opacity-75">
                        {' '}
                        SEO Infographics{' '}
                      </a>
                    </li>
                  </ul>
                </div>

                <ul className="col-span-2 flex justify-start gap-6 lg:col-span-5 lg:justify-end">
                  <li>
                    <a href="/" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                      <span className="sr-only">Facebook</span>

                      <FacebookIcon className="h-6 w-6" />
                    </a>
                  </li>

                  <li>
                    <a href="/" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                      <span className="sr-only">Instagram</span>

                      <InstagramLogoIcon className="h-6 w-6" />
                    </a>
                  </li>

                  <li>
                    <a href="/" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
                      <span className="sr-only">GitHub</span>

                      <GithubIcon className="h-6 w-6" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="sm:flex sm:justify-between">
                <p className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()}. Fusion CMS. All rights reserved.
                </p>

                <ul className="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
                  <li>
                    <a href="#" className="text-gray-500 transition hover:opacity-75">
                      {' '}
                      Terms & Conditions{' '}
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-gray-500 transition hover:opacity-75">
                      {' '}
                      Privacy Policy{' '}
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-gray-500 transition hover:opacity-75">
                      {' '}
                      Cookies{' '}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
}
