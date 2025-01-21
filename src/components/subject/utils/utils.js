import random from 'random-string-generator';
import {
  adjectives,
  desserts
} from './data';

export const getRandomIndex = array => Math.floor(Math.random() * array.length)

export const generateUsername = () => {
  const dessertIndex = getRandomIndex(desserts)
  const adjectiveIndex = getRandomIndex(adjectives)
  return `${adjectives[adjectiveIndex]}-${desserts[dessertIndex]}-${random(5).toLowerCase()}`;
}