import { withFilter } from "graphql-subscriptions";

const newFriend = {
	resolve: (payload, args, context) => {
		return payload.friendUsername;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("NEW_FRIEND"),
		(payload, args, context, info) => {
			return payload._id.toString() === context.userId.toString();
		}
	)
};

export default newFriend;