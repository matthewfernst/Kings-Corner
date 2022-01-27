const winRate = (parent, args, context, info) => {
	if(parent.totalGames === 0) return null;
	return parent.wins / parent.totalGames;
};

export default winRate;
