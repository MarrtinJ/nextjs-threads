'use server'

import { revalidatePath } from 'next/cache'
import User from '../models/user.model'
import { connectToDB, SortOrder } from '../mongoose'
import Thread from '../models/thread.model'
import { FilterQuery } from 'mongoose'

export async function fetchUser(userId: string) {
  try {
    connectToDB()

    return await User.findOne({ id: userId })
    // .populate({path: 'communities', model: Community})
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

interface Params {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  try {
    connectToDB()
    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    )

    // revalidate data associated with a specific path
    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB()

    // find all threads with userId

    // to do: populate community
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
    })

    // console.log(threads)

    return threads
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
}

export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}) {
  try {
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize

    const regex = new RegExp(searchString, 'i')

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // don't want to search for yourself
    }

    if (searchString.trim() !== '') {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    }

    const sortOptions = { createdAt: sortBy }
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()

    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext }
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}
