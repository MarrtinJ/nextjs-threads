import { fetchThreads } from '@/lib/actions/thread.actions'
import { UserButton, currentUser } from '@clerk/nextjs'

// npm run dev
export default async function Home() {
  const user = await currentUser()
  const result = await fetchThreads(1, 30)

  return (
    <div>
      <h1 className='head-text text-left'>Home</h1>
      {/* <UserButton afterSignOutUrl='/' /> */}

      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No threads found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id}
                parentId={post.parentId}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                content={post.text}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </div>
  )
}
