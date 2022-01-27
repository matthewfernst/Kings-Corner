import White from "../../static/images/logo/logo_white.png";
import Black from "../../static/images/logo/logo_black.png";

import { Link } from "react-router-dom";

const Logo = (props) => {
	return (
		<Link to={props.link ? props.link : "/"}>
			<img
				alt={"Kings Corner Logo"}
				src={props.black ? Black : White}
				style={{ height: props.height }}
			/>
		</Link>
	);
};

export default Logo;
