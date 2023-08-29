import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { database } from "@/lib/db"
import PostFeed from "./PostFeed"
import { getAuthSession } from "@/lib/auth"

const CustomFeed = async () => {

	const session = await getAuthSession()

	const followedCommunities = await database.subscription.findMany({
		where: {
			userId: session?.user.id,
		},
		include: {
			subreddit: true,
		},
	})

	const posts = await database.post.findMany({
		orderBy: {
			createdAt: "desc"
		},
		where: {
			subreddit: {
				name: {
					in: followedCommunities.map(({subreddit}) => subreddit.id),
				},
			},
		},
		include: {
			votes: true,
			author: true,
			comments: true,
			subreddit: true,
		},
		take: INFINITE_SCROLLING_PAGINATION_RESULTS,
	})

	return <PostFeed initialPosts={posts} />
}

export default CustomFeed
