import { withFilter } from "graphql-subscriptions";

const newMessage = {
	resolve: (payload, args, context) => {
		return payload.message;
	},
	subscribe: withFilter(
		(_, args, context, info) => context.pubsub.asyncIterator("NEW_MESSAGE"),
		(payload, args, context, info) => {
			return payload._id.toString() === context.userId.toString();
		}
	)
};

export default newMessage;