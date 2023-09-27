import { UserButton } from '@clerk/nextjs'

// npm run dev
export default function Home() {
  return (
    <div>
      <h1 className='head-text text-left'>Home</h1>
      {/* <UserButton afterSignOutUrl='/' /> */}
    </div>
  )
}
