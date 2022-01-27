import { withFilter } from "graphql-subscriptions";

const deletedMatch = {
	resolve: (payload, args, context) => {
		return payload.matchId;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("DELETED_MATCH"),
		(payload, args, context, info) => {
			return payload.matchId.toString() === args.matchId;
		}
	)
};

export default deletedMatch;