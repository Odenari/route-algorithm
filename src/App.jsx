import { useEffect, useState } from "react";
import styled from "styled-components";

const BOARD_SIZE = 8;
const CELL_WIDTH = "100px";

const Grid = styled.div`
  width: fit-content;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, ${CELL_WIDTH});
  grid-template-rows: repeat(${BOARD_SIZE}, ${CELL_WIDTH});
`;

const Cell = styled.div`
  ${({ bgcolor, $isStart, $isFinish, $isPath }) => `
    background-color: ${
      $isStart
        ? "green"
        : $isFinish
        ? "darkblue"
        : $isPath
        ? "darkorange"
        : bgcolor || "white"
    };
    border: 2px solid black;
    cursor: pointer;
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
  const [board, setBoard] = useState([]);
  const [path, setPath] = useState([]);
  const [startCell, setStartCell] = useState();
  const [finishCell, setFinishCell] = useState();

  const handleCellClick = (id) => {
    if (!startCell) {
      setStartCell(id);
    } else if (!finishCell && id !== startCell) {
      setFinishCell(id);
    } else {
      console.error("Start and finish already defined or the same...");
    }
  };
  const handleOnReset = () => {
    setPath([]);
    setStartCell();
    setFinishCell();
    setBoard(generateBoard(BOARD_SIZE));
  };

  const search = async () => {
    let current = startCell;
    const visited = { [startCell]: true };
    const prevMap = {};
    const toVisit = [];

    while (current) {
      await new Promise((res) => {
        setTimeout(() => res(setPath([current])), 300);
      });
      for (let next of getNeighborCells(current)) {
        if (!visited[next]) {
          visited[next] = true;
          toVisit.push(next);
          prevMap[next] = current;
        }
        if (next === finishCell) {
          return setPath(recreatePath(prevMap));
        }
      }
      //We using pop if it is deep first search
      current = toVisit.shift();
    }
    alert("Not found =(");
  };

  const recreatePath = (prevMap) => {
    const res = [finishCell];
    let current = finishCell;
    while (current !== startCell) {
      res.unshift(prevMap[current]);
      current = prevMap[current];
    }
    return res;
  };

  const getNeighborCells = (current) => {
    const [row, column] = current.split("-").map((item) => Number(item));
    const result = [];

    board[row][column + 1] && result.push(`${row}-${column + 1}`);
    board[row][column - 1] && result.push(`${row}-${column - 1}`);

    if (board[row - 1]) {
      board[row - 1][column] && result.push(`${row - 1}-${column}`);
    }
    if (board[row + 1]) {
      board[row + 1][column] && result.push(`${row + 1}-${column}`);
    }

    return result;
  };

  useEffect(() => {
    setBoard(generateBoard(BOARD_SIZE));
  }, []);
  return (
    <>
      <Grid>
        {board.map((row, rowKey) => {
          return row.map((cell, columnKey) => {
            const id = `${rowKey}-${columnKey}`;
            return (
              <Cell
                onClick={() => handleCellClick(id)}
                bgcolor={cell ? "white" : "darkred"}
                key={id}
                $isStart={id === startCell}
                $isFinish={id === finishCell}
                $isPath={path.includes(id)}
              >
                {id}
              </Cell>
            );
          });
        })}
      </Grid>
      {startCell && finishCell && (
        <>
          <Button onClick={search}>Start</Button>
          <Button onClick={handleOnReset}>Reset Board</Button>
        </>
      )}
    </>
  );
}
