import ProfileHeader from '@/components/shared/ProfileHeader'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser()

  // if no user show nothing
  if (!user) return null

  const userInfo = await fetchUser(params.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        image={userInfo.image}
        bio={userInfo.fio}
      />
    </section>
  )
}

export default Page
