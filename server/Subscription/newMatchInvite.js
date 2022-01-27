import { withFilter } from "graphql-subscriptions";

const newMatchInvite = {
	resolve: (payload, args, context) => {
		return payload.matchId;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("NEW_MATCH_INVITE"),
		(payload, args, context, info) => {
			return payload._id.toString() === context.userId.toString();
		}
	)
};

export default newMatchInvite;