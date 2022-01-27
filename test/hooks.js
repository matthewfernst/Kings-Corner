const casual = require("casual");
const sinon = require("sinon");

// Restores The Default Sandbox After Every Test

exports.mochaHooks = {
	beforeEach() {
		casual.define("_id", () => casual.array_of_digits((n = 24)).join(""));
	},
	afterEach() {
		sinon.restore();
	}
};
