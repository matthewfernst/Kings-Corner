import casual from "casual";

import { Chess } from "chess.js";

export const getRandomFenString = (moves) => {
	const chess = new Chess();
	for (let i = 0; i < moves; i++) {
		const moves = chess.moves();
		const move = moves[Math.floor(Math.random() * moves.length)];
		chess.move(move);
	}
	return chess.fen();
};

casual.define("fen", () => getRandomFenString(Math.floor(Math.random() * 30)));

const mocks = {
	User: () => ({
		__typename: "User",
		_id: casual.uuid,
		name: casual.full_name,
		username: casual.username,
		avatar: casual.url,
		email: casual.email,
		phoneNumber: casual.phone,
		password: casual.password
	}),
	Match: () => ({
		_id: casual.uuid,
		name: casual.title
	}),
	Fen: () => casual.fen,
	Rating: () => casual.integer(0, 120)
};

export default mocks;
