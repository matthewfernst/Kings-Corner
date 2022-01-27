const __resolveType = (obj, context, info) => {
	switch (obj.gameType) {
		case "TWO_PLAYER":
			return "MatchTwoPlayer";
		case "FOUR_PLAYER":
			return "MatchFourPlayer";
	}
	return null;
};

export default __resolveType;
