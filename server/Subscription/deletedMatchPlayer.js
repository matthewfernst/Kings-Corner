import { withFilter } from "graphql-subscriptions";

const deletedMatchPlayer = {
	resolve: (payload, args, context) => {
		return payload.friendUsername;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("DELETED_MATCH_PLAYER"),
		(payload, args, context, info) => {
			return payload._id.toString() === args.matchId;
		}
	)
};

export default deletedMatchPlayer;