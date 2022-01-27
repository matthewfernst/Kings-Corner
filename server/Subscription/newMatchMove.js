import { withFilter } from "graphql-subscriptions";

const newMatchMove = {
	resolve: (payload, args, context) => {
		return payload.updatedFen;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("NEW_MATCH_MOVE"),
		(payload, args, context, info) => {
			return payload._id.toString() === args.matchId;
		}
	)
};

export default newMatchMove;