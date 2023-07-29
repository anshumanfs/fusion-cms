import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ModeToggle } from '@/components/themeToggle'

export default function Home() {
  return (
    <>
      <Button>Button</Button>
      <ModeToggle />
    </>
  )
}
