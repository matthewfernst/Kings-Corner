import { gql } from "@apollo/client";

export const NewFriendRequest = gql`
	subscription NewFriendRequest {
		newFriendRequest
	}
`;

export const NewFriend = gql`
	subscription NewFriend {
		newFriend
	}
`;

export const NewMatchInvite = gql`
	subscription NewMatchInvite {
		newMatchInvite
	}
`;

export const NewMatchPlayer = gql`
	subscription NewMatchPlayer($matchId: ID!) {
		newMatchPlayer(matchId: $matchId)
	}
`;

export const DeletedMatchPlayer = gql`
	subscription DeletedMatchPlayer($matchId: ID!) {
		deletedMatchPlayer(matchId: $matchId)
	}
`;

export const DeletedMatch = gql`
	subscription DeletedMatch($matchId: ID!) {
		deletedMatch(matchId: $matchId)
	}
`;

export const NewMatchInProgress = gql`
	subscription NewMatchInProgress($matchId: ID!) {
		newMatchInProgress(matchId: $matchId)
	}
`;

export const NewMatchMove = gql`
	subscription NewMatchMove($matchId: ID!) {
		newMatchMove(matchId: $matchId)
	}
`;

export const NewMessage = gql`
	subscription NewMessage {
		newMessage {
			_id
			date
			message
			from
		}
	}
`;
