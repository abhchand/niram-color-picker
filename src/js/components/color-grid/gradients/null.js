import Gradient from 'models/gradient';
import { GRADIENT_LEN } from '../constants';

const generateNullGradients = (count) => {
  const gradients = [];

  for (let i = 0; i < count; i++) {
    const gradient = new Gradient();

    for (let j = 0; j < GRADIENT_LEN; j++) {
      gradient.addNull();
    }

    gradients.push(gradient);
  }

  return gradients;
};

export { generateNullGradients };
