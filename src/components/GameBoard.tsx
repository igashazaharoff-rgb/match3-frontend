import React, { useState, useEffect, useRef } from 'react';
import { findMatches, removeMatches, dropPieces } from '../utils/gameLogic';
import DailyQuests from './DailyQuests';
import Achievements from './Achievements';
import { useGameAPI } from '../hooks/useGameAPI';
import { useTelegram } from '../hooks/useTelegram';

const BOARD_SIZE = 8;
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const GameBoard = () => {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [target, setTarget] = useState<number>(1000);
  const [energy, setEnergy] = useState<number>(5);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [removing, setRemoving] = useState<{ row: number; col: number }[]>([]);

  const moveSoundRef = useRef<HTMLAudioElement>(null);
  const matchSoundRef = useRef<HTMLAudioElement>(null);
  const { user } = useTelegram();
  const { saveProgress } = useGameAPI();

  useEffect(() => {
    const saved = localStorage.getItem('match3-progress');
    if (saved) {
      const data = JSON.parse(saved);
      setScore(data.score);
      setLevel(data.level);
      setTarget(data.target);
      setEnergy(data.energy);
    } else {
      generateBoard();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('match3-progress', JSON.stringify({ score, level, target, energy }));
  }, [score, level, target, energy]);

  useEffect(() => {
    moveSoundRef.current = new Audio('/sounds/move.mp3');
    matchSoundRef.current = new Audio('/sounds/match.mp3');
  }, []);

  const generateBoard = () => {
    const newBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        row.push(Math.floor(Math.random() * COLORS.length));
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  };

  const playSound = (type: 'move' | 'match') => {
    if (type === 'move') moveSoundRef.current?.play();
    if (type === 'match') matchSoundRef.current?.play();
  };

  const handleCellClick = (row: number, col: number) => {
    if (energy <= 0) {
      alert('Нет энергии! Подожди или посмотри рекламу.');
      return;
    }

    if (!selected) {
      setSelected({ row, col });
      playSound('move');
      return;
    }

    const dx = Math.abs(selected.row - row);
    const dy = Math.abs(selected.col - col);

    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      setEnergy(prev => prev - 1);
      const newBoard = [...board];
      [newBoard[selected.row][selected.col], newBoard[row][col]] = [newBoard[row][col], newBoard[selected.row][selected.col]];
      setBoard(newBoard);

      const { toRemove, specialCells } = find
