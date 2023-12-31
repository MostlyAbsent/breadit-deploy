import { getAuthSession } from "@/lib/auth"
import { database } from "@/lib/db"
import { CommentVoteValidator, PostVoteValidator } from "@/lib/validators/vote"
import { z } from "zod"

export async function PATCH(req: Request) {
	try {
		const body = await req.json()

		const { commentId, voteType } = CommentVoteValidator.parse(body)

		const session = await getAuthSession()

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 })
		}

		const existingVote = await database.commentVote.findFirst({
			where: {
				userId: session.user.id,
				commentId,
			}
		})

		if (existingVote) {
			if (existingVote.type === voteType) {
				await database.commentVote.delete({
					where: {
						userId_commentId: {
							commentId,
							userId: session.user.id,
						}
					}
				})
				return new Response("OK")
			} else {

				await database.commentVote.update({

					where: {
						userId_commentId: {
							commentId,
							userId: session.user.id,
						},
					},
					data: {
						type: voteType,
					}
				})

				return new Response("OK")
			}
		}

		await database.commentVote.create({
			data: {
				type: voteType,
				userId: session.user.id,
				commentId,
			},
		})

		return new Response("OK")
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response("Invalid request data passed", { status: 422 })
		}

		return new Response("Could not vote, please try again", { status: 500 })
	}
}
