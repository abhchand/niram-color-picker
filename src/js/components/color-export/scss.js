const toValue = (color, colorModel) => {
  let c;

  switch (colorModel) {
    case 'rgb':
      c = color.toRGB().value();
      return `rgb(${c.r}, ${c.g}, ${c.b})`;

    case 'hex':
      c = color.toHex().value();
      return `#${c}`;

    case 'hsl':
      c = color.toHSL().value();
      return `hsl(${c.h.toFixed(1)}, ${(100 * c.s).toFixed(2)}%, ${(
        100 * c.l
      ).toFixed(2)}%)`;

    default:
      return 'unknown';
  }
};

const toScss = (colorGrid, colorModel) => {
  const lines = [];

  ['primary', 'neutral', 'accent'].forEach((gradientType) => {
    (colorGrid[gradientType] || []).forEach((gradient, gradientIdx) => {
      gradient.forEach((color, positionIdx) => {
        const name = `${gradientType}_${gradientIdx}_${
          (positionIdx + 1) * 100
        }`;
        lines.push(`$${name}: ${toValue(color, colorModel)};`);
      });
    });
  });

  return `
/*
 * Generated by Niram Color Picker
 * ${window.location.href}
 */

${lines.join('\n')}
`;
};

export { toScss };
