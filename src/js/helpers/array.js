/*
 * Shuffles an array using Fisher-Yates shuffle
 * See: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};

export { shuffleArray };
