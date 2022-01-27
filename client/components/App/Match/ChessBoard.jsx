import { useEffect } from "react";

import { Box } from "@mui/material";

import { DndProvider, useDrag, useDragLayer, useDrop } from "react-dnd";
import { getEmptyImage, HTML5Backend } from "react-dnd-html5-backend";

import Chess from "chess.js";

const ChessBoard = (props) => {
	const chess = new Chess(props.match.fen);
	const board = props.playerColor === "w" ? chess.board() : chess.board().reverse();
	return (
		<DndProvider backend={HTML5Backend}>
			<Box position={"relative"} style={{ overflow: "hidden" }}>
				<img
					style={{
						width: "100%",
						maxWidth: "70vh",
						maxHeight: "70vh",
						boxShadow:
							"rgb(0 0 0 / 20%) 0px 3px 5px -1px, rgb(0 0 0 / 14%) 0px 5px 8px 0px, rgb(0 0 0 / 12%) 0px 1px 14px 0px"
					}}
					src={props.match.boardSkin.images}
				/>
				<Box
					width={"100%"}
					height={"98.5%"}
					display={"flex"}
					flexWrap={"wrap"}
					style={{ position: "absolute", top: 0, left: 0 }}
				>
					{[].concat(...board).map((item, index) => (
						<BoardSquare
							key={index}
							boardState={props.match.fen}
							row={Math.floor(index / 8)}
							col={index % 8}
							{...props}
						>
							<Piece
								row={Math.floor(index / 8)}
								col={index % 8}
								item={item}
								{...props}
							/>
						</BoardSquare>
					))}
				</Box>
				<CustomDragLayer {...props} />
			</Box>
		</DndProvider>
	);
};

const BoardSquare = (props) => {
	const [{ isOver, canDrop }, drop] = useDrop({
		accept: "piece",
		canDrop: (item) => {
			if (!props.isTurn) return false;
			const isWhite = props.playerColor === "w";
			const moveStringObject = {
				fromSquare: indexToColLetter(item.col) + (isWhite ? 8 - item.row : item.row + 1),
				toSquare: indexToColLetter(props.col) + (isWhite ? 8 - props.row : props.row + 1)
			};

			const chess = new Chess(props.boardState);
			const possibleMoves = chess.moves({ square: moveStringObject.fromSquare });

			let isValidMove = false;
			for (let i = 0; i < possibleMoves.length; i++) {
				if (possibleMoves[i].includes(moveStringObject.toSquare)) {
					isValidMove = true;
				}
			}
			return isValidMove;
		},
		drop: (item) => {
			const isWhite = props.playerColor === "w";
			const moveStringObject = {
				fromSquare: indexToColLetter(item.col) + (isWhite ? 8 - item.row : item.row + 1),
				toSquare: indexToColLetter(props.col) + (isWhite ? 8 - props.row : props.row + 1)
			};

			const chess = new Chess(props.boardState);
			chess.move({ from: moveStringObject.fromSquare, to: moveStringObject.toSquare });
			if (chess.game_over()) {
				props.resolveMatch({
					variables: {
						matchId: props.matchId,
						finalFen: chess.fen()
					}
				});
			} else {
				props.makeMove({
					variables: {
						matchId: props.matchId,
						updatedFen: chess.fen()
					}
				});
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop()
		})
	});

	if (!isOver && canDrop) {
		return (
			<Box
				width={"12.5%"}
				height={"12.5%"}
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				ref={drop}
			>
				<Box width={"30%"} height={"30%"} borderRadius={"200%"} bgcolor={"#555"} />
			</Box>
		);
	}

	return (
		<Box width={"12.5%"} height={"12.5%"} ref={drop}>
			{props.children}
		</Box>
	);
};

const Piece = (props) => {
	const [{ isDragging }, drag, preview] = useDrag({
		type: "piece",
		item: { item: props.item, row: props.row, col: props.col },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging()
		})
	});

	useEffect(() => {
		preview(getEmptyImage());
	}, []);

	const image =
		props.item &&
		fenLetterToImage(
			props.item,
			props.playerColor,
			props.match.pieceSkin.images,
			props.match.pieceSkin.thumbnail
		);

	return (
		<Box
			style={{
				width: "100%",
				height: "100%",
				cursor: props.isTurn ? "move" : undefined,
				overflow: "visible"
			}}
			ref={drag}
		>
			{image && !isDragging && (
				<img
					style={{
						width: "100%",
						height: props.is3D ? "150%" : "100%",
						position: props.is3D ? "absolute" : undefined,
						top: props.is3D ? "-35%" : undefined
					}}
					src={image}
				/>
			)}
		</Box>
	);
};

const CustomDragLayer = (props) => {
	const getItemStyles = (initialOffset, currentOffset) => {
		if (!initialOffset || !currentOffset) return { display: "none" };
		const offsetX = currentOffset.x - initialOffset.x;
		const offsetY = currentOffset.y - initialOffset.y;
		const transform = `translate(${offsetX}px, ${offsetY}px)`;
		return { transform, WebkitTransform: transform };
	};

	const { item, initialOffset, currentOffset, isDragging } = useDragLayer((monitor) => ({
		item: monitor.getItem(),
		initialOffset: monitor.getInitialSourceClientOffset(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging()
	}));

	if (!isDragging) return null;

	return (
		<Box
			width={"100%"}
			height={"100%"}
			style={{
				position: "absolute",
				top: item.row * 12.5 + "%",
				left: item.col * 12.5 + "%",
				pointerEvents: "none"
			}}
		>
			<Box style={getItemStyles(initialOffset, currentOffset)}>
				<img
					style={{ width: "12.5%", height: "12.5%" }}
					src={fenLetterToImage(
						item.item,
						props.playerColor,
						props.match.pieceSkin.images,
						props.match.pieceSkin.thumbnail
					)}
				/>
			</Box>
		</Box>
	);
};

const fenLetterToImage = ({ type, color }, playerColor, folderUrl, thumbnailUrl) => {
	const thumbnameUrlAsArray = thumbnailUrl.split(".");
	const fileExtension = "." + thumbnameUrlAsArray[thumbnameUrlAsArray.length - 1];
	const is3D = fileExtension === ".png";
	switch (type) {
		case "r":
			return color === "b"
				? folderUrl + "Black-Rook" + fileExtension
				: folderUrl + "White-Rook" + fileExtension;
		case "n":
			return color === "b"
				? playerColor === "b" || !is3D
					? folderUrl + "Black-Knight" + fileExtension
					: folderUrl + "Black-Knight-Flipped" + fileExtension
				: playerColor === "w" || !is3D
				? folderUrl + "White-Knight" + fileExtension
				: folderUrl + "White-Knight-Flipped" + fileExtension;
		case "b":
			return color === "b"
				? playerColor === "b" || !is3D
					? folderUrl + "Black-Bishop" + fileExtension
					: folderUrl + "Black-Bishop-Flipped" + fileExtension
				: playerColor === "w" || !is3D
				? folderUrl + "White-Bishop" + fileExtension
				: folderUrl + "White-Bishop-Flipped" + fileExtension;
		case "q":
			return color === "b"
				? folderUrl + "Black-Queen" + fileExtension
				: folderUrl + "White-Queen" + fileExtension;
		case "k":
			return color === "b"
				? folderUrl + "Black-King" + fileExtension
				: folderUrl + "White-King" + fileExtension;
		case "p":
			return color === "b"
				? folderUrl + "Black-Pawn" + fileExtension
				: folderUrl + "White-Pawn" + fileExtension;
		default:
			return null;
	}
};

const indexToColLetter = (index) => {
	return String.fromCharCode("a".charCodeAt(0) + index);
};

export default ChessBoard;
