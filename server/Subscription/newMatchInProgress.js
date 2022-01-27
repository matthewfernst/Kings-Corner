import { withFilter } from "graphql-subscriptions";

const newMatchInProgress = {
	resolve: (payload, args, context) => {
		return payload.inProgress;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("NEW_MATCH_IN_PROGRESS"),
		(payload, args, context, info) => {
			return payload._id.toString() === args.matchId;
		}
	)
};

export default newMatchInProgress;