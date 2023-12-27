import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/themeToggle';
import { CodeBlock } from '@/components/ui/codeBlock';
import Logo from '@/components/ui/logo';

const commands = ['npm i', 'yarn add', 'pnpm add'];

export default function Home() {
  return (
    <>
      <section>
        <header className="body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a className="flex title-font font-medium items-center mb-4 md:mb-0">
              <Logo width={50} height={50} />
              <span className="ml-3 text-xl">Fusion CMS</span>
            </a>
            <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              <a className="mr-5 hover:text-gray-500">First Link</a>
              <a className="mr-5 hover:text-gray-500">Second Link</a>
              <a className="mr-5 hover:text-gray-500">Third Link</a>
              <a className="mr-5 hover:text-gray-500">Fourth Link</a>
            </nav>
            <ModeToggle />
          </div>
        </header>

        <div className="container mx-auto flex px-5 pt-24 items-center justify-center flex-col">
          <span className="text-5xl font-medium">Don&apos;t waste effort in building APIs again</span>
          <span className="m-4 text-gray-500 text-2xl">Define your schema and expose apis in minutes</span>
        </div>
        <div className="container mx-auto flex px-5 pt-24 items-center justify-center flex-col">
          <div className="mb-4 mt-12 inline-flex flex-col items-center space-x-0 space-y-4 text-center sm:flex-row sm:space-x-4 sm:space-y-0">
            {commands.map((command, index) => {
              return (
                <>
                  <CodeBlock command={`${command} fusion-cms`}>
                    <span className="flex-1">
                      <span className="dark:text-white text-slate-800">{command}</span>
                      <span className="dark:text-yellow-500 text-green-600 ml-2">fusion-cms</span>
                    </span>
                  </CodeBlock>
                  {index !== commands.length - 1 && (
                    <span className="bg-slate-800 dark:bg-white  hidden h-5 w-px md:inline-flex"></span>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
