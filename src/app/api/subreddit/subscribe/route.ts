import { getAuthSession } from "@/lib/auth";
import { database } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession()

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 })
		}

		const body = await req.json()

		const { subredditId } = SubredditSubscriptionValidator.parse(body)

		const subscriptionExists = await database.subscription.findFirst({
			where: {
				subredditId,
				userId: session.user.id,
			}
		})

		if (subscriptionExists) {
			return new Response("You are already subscribed to the subreddit.", { status: 400 })
		}

		await database.subscription.create({
			data: {
				subredditId,
				userId: session.user.id
			}
		})

		return new Response(subredditId)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("Invalid request data passed", { status: 422 })
		}

		return new Response("Could not subscribe", { status: 500 })
	}
}