const serializeGradients = (state) => {
  const baseColorHexValues = [];

  const perform = (gradients) => {
    gradients.forEach((gradient) => {
      const hexColor = gradient.baseColor().toHex();
      baseColorHexValues.push(hexColor.value());
    });
  };

  perform(state.primaryGradients);
  perform(state.neutralGradients);
  perform(state.accentGradients);

  return baseColorHexValues.join('-');
};

const serializeOverrides = (state) => {
  const serializedOverrides = {};

  const perform = (gradients, shorthand) => {
    gradients.forEach((gradient, gradientIdx) => {
      const hexValues = gradient.map((color) => {
        return color ? color.toHex().value() : '';
      });

      if (hexValues.join('').length === 0) {
        return;
      }

      const key = [shorthand, gradientIdx].join('');
      serializedOverrides[key] = hexValues.join(',');
    });
  };

  perform(state.primaryOverrides, 'p');
  perform(state.neutralOverrides, 'n');
  perform(state.accentOverrides, 'a');

  return serializedOverrides;
};

export { serializeGradients, serializeOverrides };
