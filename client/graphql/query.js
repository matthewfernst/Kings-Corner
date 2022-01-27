import { gql } from "@apollo/client";

export const GetInfoFromSearch = gql`
	query GetInfoFromSearch($query: String!) {
		selfLookup {
			username
			friends {
				username
				avatar
				matches {
					players {
						username
					}
				}
			}
			matches {
				_id
				name
				players {
					avatar
				}
				fen
				whitePlayer {
					username
				}
			}
			outgoingFriendRequests {
				username
			}
		}
		userSearch(query: $query) {
			username
			avatar
		}
		matchSearch(query: $query) {
			_id
			name
			players {
				avatar
			}
			fen
			whitePlayer {
				username
			}
		}
	}
`;

export const GetHeaderNotifications = gql`
	query GetHeaderNotifications {
		selfLookup {
			matchInvites {
				_id
				players {
					username
					avatar
				}
			}
			incomingFriendRequests {
				username
				avatar
			}
		}
	}
`;

export const GetFriendInfo = gql`
	query GetFriendInfo($name: String, $username: String, $email: String) {
		userLookup(name: $name, username: $username, email: $email) {
			username
			avatar
		}
	}
`;

export const GetHeaderProfile = gql`
	query GetHeaderProfile {
		selfLookup {
			username
			avatar
		}
	}
`;

export const GetMessages = gql`
	query GetMessages {
		selfLookup {
			username
			avatar
			messages {
				_id
				date
				message
				to {
					username
					avatar
				}
				from {
					username
					avatar
				}
				readBy {
					username
				}
			}
		}
	}
`;

export const GetMissions = gql`
	query GetMissions {
		selfLookup {
			missions {
				_id
				name
				description
				progress
				threshold
				gainedXP
			}
		}
	}
`;

export const GetTraditionalProfile = gql`
	query GetTraditionalProfile {
		selfLookup {
			username
			avatar
			playerStatistics {
				rating
				wins
				losses
				stalemates
				totalGames
				winRate
			}
		}
	}
`;

export const GetUserSettings = gql`
	query GetUserSettings {
		selfLookup {
			email
			username
			password
		}
	}
`;

export const GetMatchHistory = gql`
	query GetMatchHistory {
		selfLookup {
			username
			finishedMatches {
				_id
				name
				inProgress
				players {
					username
					avatar
				}
				whitePlayer {
					username
				}
				blackPlayer {
					username
				}
				fen
				matchResults {
					winner {
						username
					}
				}
			}
		}
	}
`;

export const GetStatisticsOverview = gql`
	query GetStatisticsOverview {
		selfLookup {
			playerStatistics {
				wins
				losses
				stalemates
				totalGames
				winRate
			}
		}
	}
`;

export const GetRankHistoryOverview = gql`
	query GetRankHistoryOverview {
		selfLookup {
			playerStatistics {
				ratingHistory
			}
		}
	}
`;

export const GetTopPlayers = gql`
	query GetTopPlayers($first: Int!) {
		userTopRating(first: $first) {
			avatar
			username
			playerStatistics {
				rating
			}
		}
	}
`;

export const GetMatchesOverview = gql`
	query GetMatchesOverview {
		selfLookup {
			username
			matches {
				_id
				name
				inProgress
				players {
					username
					avatar
				}
				whitePlayer {
					username
				}
				blackPlayer {
					username
				}
				fen
			}
		}
	}
`;

export const GetFriends = gql`
	query GetFriends {
		selfLookup {
			username
			friends {
				username
				avatar
			}
		}
	}
`;

export const GetMatchData = gql`
	query GetMatchData($_id: ID!) {
		selfLookup {
			username
			avatar
		}
		matchLookup(_id: $_id) {
			_id
			name
			matchOwner {
				username
			}
			pendingPlayers {
				username
				avatar
			}
			players {
				username
				avatar
			}
			inProgress
			boardSkin {
				_id
				images
				thumbnail
			}
			pieceSkin {
				_id
				images
				thumbnail
			}
			whitePlayer {
				username
				avatar
			}
			blackPlayer {
				username
				avatar
			}
			fen
			fenHistory
		}
	}
`;

export const GetOwnedItems = gql`
	query GetOwnedItems {
		selfLookup {
			items {
				_id
				type
				name
				description
				thumbnail
			}
		}
	}
`;

export const GetUserShopInformation = gql`
	query GetUserShopInformation {
		selfLookup {
			items {
				_id
				type
				name
				description
				thumbnail
			}
			battlePass {
				_id
			}
			money
		}
		shop {
			items {
				_id
				type
				name
				description
				thumbnail
				cost
			}
		}
	}
`;

export const GetBattlePassItems = gql`
	query GetBattlePassItems {
		selfLookup {
			battlePass {
				_id
				items {
					name
					description
					thumbnail
				}
				tiers
				cost
				totalXP
				currentTier
			}
		}
	}
`;
