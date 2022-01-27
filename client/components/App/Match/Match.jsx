import { useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useQuery, useMutation } from "@apollo/client";
import { GetMatchData } from "../../../graphql/query.js";
import {
	EditMatch,
	DeleteUserFromMatch,
	DeleteMatch,
	StartMatch,
	MakeMove,
	ResolveMatch
} from "../../../graphql/mutation.js";
import {
	NewMatchPlayer,
	DeletedMatchPlayer,
	DeletedMatch,
	NewMatchInProgress,
	NewMatchMove
} from "../../../graphql/subscription.js";

import NoGame from "./NoGame.jsx";
import PreGame from "./PreGame.jsx";
import PostGame from "./PostGame.jsx";
import InGame from "./InGame.jsx";

import Chess from "chess.js";

const Match = (props) => {
	const { matchId } = useParams();
	const navigate = useNavigate();

	const { loading, error, data, subscribeToMore } = useQuery(GetMatchData, {
		variables: { _id: matchId }
	});

	const [editMatch] = useMutation(EditMatch);
	const [deleteUserFromMatch] = useMutation(DeleteUserFromMatch);
	const [deleteMatch] = useMutation(DeleteMatch);
	const [startMatch] = useMutation(StartMatch);
	const [makeMove] = useMutation(MakeMove);
	const [resolveMatch] = useMutation(ResolveMatch);

	useEffect(() => {
		subscribeToMore({
			document: NewMatchPlayer,
			variables: { matchId: matchId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					...prev,
					matchLookup: {
						...prev.matchLookup,
						players: [...prev.matchLookup.players, subscriptionData.data.newMatchPlayer]
					}
				};
			}
		});
		subscribeToMore({
			document: DeletedMatchPlayer,
			variables: { matchId: matchId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					...prev,
					matchLookup: {
						...prev.matchLookup,
						players: prev.matchLookup.players.filter(
							(player) => player.username !== subscriptionData.data.deletedMatchPlayer
						)
					}
				};
			}
		});
		subscribeToMore({
			document: DeletedMatch,
			variables: { matchId: matchId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				navigate("/app/matches");
				return {};
			}
		});
		subscribeToMore({
			document: NewMatchInProgress,
			variables: { matchId: matchId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					...prev,
					matchLookup: {
						...prev.matchLookup,
						inProgress: subscriptionData.data.newMatchInProgress
					}
				};
			}
		});
		subscribeToMore({
			document: NewMatchMove,
			variables: { matchId: matchId },
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				return {
					...prev,
					matchLookup: {
						...prev.matchLookup,
						fen: subscriptionData.data.newMatchMove,
						fenHistory: [...prev.matchLookup.fenHistory, prev.matchLookup.fen]
					}
				};
			}
		});
	}, []);

	if (loading || error) return null;

	if (!data.matchLookup) {
		return <NoGame />;
	}

	if (!data.matchLookup.inProgress) {
		const chess = new Chess(data.matchLookup.fen);
		if (chess.game_over()) {
			return <PostGame matchId={matchId} matchData={data} />;
		}
		return (
			<PreGame
				matchId={matchId}
				matchData={data}
				editMatch={editMatch}
				deleteUserFromMatch={deleteUserFromMatch}
				deleteMatch={deleteMatch}
				startMatch={startMatch}
			/>
		);
	}

	return (
		<InGame
			matchId={matchId}
			matchData={data}
			editMatch={editMatch}
			makeMove={makeMove}
			resolveMatch={resolveMatch}
		/>
	);
};

export default Match;
