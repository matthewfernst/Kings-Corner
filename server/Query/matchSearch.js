const matchSearch = (_, args, context, info) => {
	const parseQueryForRegex = (query) => {
		const reservedCharacters = [".", "?", "+", "*", "|", "{", "}", "[", "]", "(", ")"];
		const otherCharacters = ['"', "\\", "@"];
		return [...query]
			.map((char) => {
				if (reservedCharacters.includes(char)) return `\\${char}`;
				else if (otherCharacters.includes(char)) return ".[1]";
				else return char;
			})
			.join("");
	};
	return context.db
		.collection("Matches")
		.aggregate([
			{
				$search: {
					regex: {
						path: ["name"],
						query: `(.*)${parseQueryForRegex(args.query)}(.*)`,
						allowAnalyzedField: true
					}
				}
			}
		])
		.toArray();
};

export default matchSearch;