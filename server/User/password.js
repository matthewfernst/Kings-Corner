import CryptoJS from "crypto-js";
import dotenv from "dotenv";

import { checkIsMe } from "../utils.js";

dotenv.config();

const password = async (parent, args, context, info) => {
	await checkIsMe(parent, context);
	const bytes  = CryptoJS.AES.decrypt(parent.password, process.env.PASSWORD_KEY);
	return bytes.toString(CryptoJS.enc.Utf8);
};

export default password;
