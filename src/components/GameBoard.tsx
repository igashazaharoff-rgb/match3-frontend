1:  import React, { useState, useEffect, useRef } from 'react';
2:  import { findMatches, removeMatches, dropPieces } from '../utils/gameLogic';
3:  import DailyQuests from './DailyQuests';
4:  import Achievements from './Achievements';
5:  import { useGameAPI } from '../hooks/useGameAPI';
6:  import { useTelegram } from '../hooks/useTelegram';
7:
8:  const BOARD_SIZE = 8;
9:  const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
10:
11: const GameBoard = () => {
12:   const [board, setBoard] = useState<number[][]>([]);
13:   const [score, setScore] = useState<number>(0);
14:   const [level, setLevel] = useState<number>(1);
15:   const [target, setTarget] = useState<number>(1000);
16:   const [energy, setEnergy] = useState<number>(5);
17:   const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
18:   const [removing, setRemoving] = useState<{ row: number; col: number }[]>([]);
19:
20:   const moveSoundRef = useRef<HTMLAudioElement>(null);
21:   const matchSoundRef = useRef<HTMLAudioElement>(null);
22:   const { user } = useTelegram();
23:   const { saveProgress } = useGameAPI();
24:
25:   useEffect(() => {
26:     const saved = localStorage.getItem('match3-progress');
27:     if (saved) {
28:       const data = JSON.parse(saved);
29:       setScore(data.score);
30:       setLevel(data.level);
31:       setTarget(data.target);
32:       setEnergy(data.energy);
33:     } else {
34:       generateBoard();
35:     }
36:   }, []);
37:
38:   useEffect(() => {
39:     localStorage.setItem('match3-progress', JSON.stringify({ score, level, target, energy }));
40:   }, [score, level, target, energy]);
41:
42:   useEffect(() => {
43:     moveSoundRef.current = new Audio('/sounds/move.mp3');
44:     matchSoundRef.current = new Audio('/sounds/match.mp3');
45:   }, []);
46:
47:   const generateBoard = () => {
48:     const newBoard = [];
49:     for (let i = 0; i < BOARD_SIZE; i++) {
50:       const row = [];
51:       for (let j = 0; j < BOARD_SIZE; j++) {
52:         row.push(Math.floor(Math.random() * COLORS.length));
53:       }
54:       newBoard.push(row);
55:     }
56:     setBoard(newBoard);
57:   };
58:
59:   const playSound = (type: 'move' | 'match') => {
60:     if (type === 'move') moveSoundRef.current?.play();
61:     if (type === 'match') matchSoundRef.current?.play();
62:   };
63:
64:   const handleCellClick = (row: number, col: number) => {
65:     if (energy <= 0) {
66:       alert('Нет энергии! Подожди или посмотри рекламу.');
67:       return;
68:     }
69:
70:     if (!selected) {
71:       setSelected({ row, col });
72:       playSound('move');
73:       return;
74:     }
75:
76:     const dx = Math.abs(selected.row - row);
77:     const dy = Math.abs(selected.col - col);
78:
79:     if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
80:       setEnergy(prev => prev - 1);
81:       const newBoard = [...board];
82:       [newBoard[selected.row][selected.col], newBoard[row][col]] = [newBoard[row][col], newBoard[selected.row][selected.col]];
83:       setBoard(newBoard);
84:
85:       const { toRemove, specialCells } = findMatches(newBoard); // ← Вот тут была ошибка
86:       if (toRemove.length > 0) {
87:         const points = toRemove.length * 10 + specialCells.length * 50;
88:         setScore(prev => prev + points);
89:
90:         setRemoving(toRemove);
91:         setTimeout(() => {
92:           let updatedBoard = removeMatches(newBoard, toRemove, specialCells);
93:           updatedBoard = dropPieces(updatedBoard);
94:           setBoard(updatedBoard);
95:           setRemoving([]);
96:           playSound('match');
97:
98:           if (score + points >= target) {
99:             setLevel(prev => prev + 1);
100:            setTarget(prev => prev * 2);
101:          }
102:
103:          // Сохранить прогресс
104:          if (user) {
105:            saveProgress({ score: score + points, level, energy: energy - 1 }, user.id);
106:          }
107:        }, 300);
108:      } else {
109:        [newBoard[selected.row][selected.col], newBoard[row][col]] = [newBoard[row][col], newBoard[selected.row][selected.col]];
110:       setBoard(newBoard);
111:       setEnergy(prev => prev + 1);
112:      }
113:    }
114:    setSelected(null);
115:  };
116:
117:  const renderCell = (colorIndex: number) => {
118:    if (colorIndex === 6) return 'cell-bomb';
119:    if (colorIndex === 7) return 'cell-rainbow';
120:    return `cell-${COLORS[colorIndex]}`;
121:  };
122:
123:  return (
124:    <div className="game-board-container">
125:      <div className="score-board">
126:        <div>Уровень: {level}</div>
127:        <div>Счёт: {score}</div>
128:        <div>Цель: {target}</div>
129:        <div>Энергия: {energy}/5</div>
130:      </div>
131:      <div className="game-board">
132:        {board.map((row, i) =>
133:          row.map((colorIndex, j) => (
134:            <div
135:              key={`${i}-${j}`}
136:              className={`cell ${renderCell(colorIndex)} ${selected?.row === i && selected?.col === j ? 'selected' : ''} ${removing.some(c => c.row === i && c.col === j) ? 'removing' : ''}`}
137:              onClick={() => handleCellClick(i, j)}
138:            />
139:          ))
140:        )}
141:      </div>
142:      <DailyQuests />
143:      <Achievements />
144:    </div>
145:  );
146: };
147:
148: export default GameBoard;

