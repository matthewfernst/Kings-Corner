import { withFilter } from "graphql-subscriptions";

const newMatchPlayer = {
	resolve: (payload, args, context) => {
		return payload.newPlayer;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("NEW_MATCH_PLAYER"),
		(payload, args, context, info) => {
			return payload._id.toString() === args.matchId;
		}
	)
};

export default newMatchPlayer;