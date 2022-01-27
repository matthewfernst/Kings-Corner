import dotenv from "dotenv";

import { MongoClient } from "mongodb";

dotenv.config();

export const client = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

export const removeNullArgs = (args) => {
	return Object.fromEntries(Object.entries(args).filter(([_, v]) => v != null));
};
