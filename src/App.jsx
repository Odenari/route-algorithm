import { useEffect, useState } from 'react';
import styled from 'styled-components';

const SIZE = '5';
const WIDTH = '120px';

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(${SIZE}, 120px);
	grid-template-rows: repeat(${SIZE}, 120px);
`;

const Cell = styled.div`
	${({ bgColor }) => `
    background-color: ${bgColor || 'white'};
    border: 2px solid black;
  `}
`;

const Button = styled.button`
	display: block;
	margin: 1em auto;
	min-width: 200px;
	font-size: 2em;
	padding: 0 0.5em;
`;

function generateBoard(size) {
	const arr = [];
	for (let i = 0; i < size; i++) {
		arr.push([]);
		for (let j = 0; j < size; j++) {
			arr[i][j] = Math.random() * 100 > 49 ? 1 : 0;
		}
	}
	return arr;
}

export default function App() {
	const [board, setBoard] = useState([[]]);

	useEffect(() => {
		setBoard(generateBoard(SIZE));
	}, []);
	return (
		<>
			<Grid>
				{board.map((row, rowKey) => {
					row.map((cell, columnKey) => {
						const id = `${rowKey}-${columnKey}`;
						return (
							<Cell bgColor={cell ? 'white' : 'darkred'} key={id}>
								{id}
							</Cell>
						);
					});
				})}
			</Grid>
			<Button>Start</Button>
		</>
	);
}
