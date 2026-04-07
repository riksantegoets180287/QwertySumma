
import { Task } from '../types';

const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");
const SHIFT_SYMBOLS = "!@#$%^&*(".split("");
// Tekens verwijderd op verzoek: ' " `
const PUNCTUATION = "{[]};:\\|,. < >/?~_-+=".split("").filter(c => c !== " ");

const getHint = (char: string): string => {
  if (/[a-z]/.test(char)) return "Dit is een kleine letter.";
  if (/[A-Z]/.test(char)) return "Dit is een grote letter. Gebruik de Shift-toets.";
  if (/[0-9]/.test(char)) return "Dit is een cijfer.";
  if (SHIFT_SYMBOLS.includes(char)) {
    const num = "123456789".charAt(SHIFT_SYMBOLS.indexOf(char));
    return `Houd Shift ingedrukt en druk op de ${num}.`;
  }
  
  const mappings: Record<string, string> = {
    '[': 'Het haakje dat open gaat [.',
    ']': 'Het haakje dat dicht gaat ].',
    '{': 'Houd Shift ingedrukt en druk op [.',
    '}': 'Houd Shift ingedrukt en druk op ].',
    ';': 'Dit is de punt-komma.',
    ':': 'Houd Shift ingedrukt en druk op de punt-komma.',
    '\\': 'De schuine streep naar links.',
    '|': 'Houd Shift ingedrukt en druk op de schuine streep.',
    ',': 'Dit is de komma.',
    '<': 'Houd Shift ingedrukt en druk op de komma.',
    '.': 'Dit is de punt.',
    '>': 'Houd Shift ingedrukt en druk op de punt.',
    '/': 'De schuine streep naar rechts.',
    '?': 'Houd Shift ingedrukt en druk op de schuine streep.',
    '~': 'De wiebel-lijn. Gebruik Shift en de toets naast de 1.',
    '-': 'Dit is het liggende streepje.',
    '_': 'De lage streep. Gebruik Shift en het streepje.',
    '=': 'Het is-gelijk teken.',
    '+': 'Houd Shift ingedrukt en druk op het is-gelijk teken.'
  };
  
  return mappings[char] || "Dit is een speciaal teken.";
};

export const generateTasks = (): Task[] => {
  const tasks: Task[] = [];
  const charCounts: Record<string, number> = {};

  const getRandomFrom = (pool: string[]): string => {
    let char = pool[Math.floor(Math.random() * pool.length)];
    let safety = 0;
    // Maximaal 2 keer hetzelfde teken per sessie voor afwisseling
    while (charCounts[char] >= 2 && safety < 100) {
      char = pool[Math.floor(Math.random() * pool.length)];
      safety++;
    }
    charCounts[char] = (charCounts[char] || 0) + 1;
    return char;
  };

  // 1-5: Alleen letters
  for (let i = 0; i < 5; i++) {
    const char = getRandomFrom(LETTERS);
    tasks.push({ character: char, hint: getHint(char) });
  }

  // 6-50: Mix van alles (behalve de verwijderde tekens)
  const mixedPool = [...LETTERS, ...NUMBERS, ...SHIFT_SYMBOLS, ...PUNCTUATION];
  for (let i = 5; i < 50; i++) {
    const char = getRandomFrom(mixedPool);
    tasks.push({ character: char, hint: getHint(char) });
  }

  return tasks;
};
