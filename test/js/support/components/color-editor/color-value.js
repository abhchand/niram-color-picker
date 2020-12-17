const getHexInputValues = () => {
  return getInputValue('hex');
};

const getHSLInputValues = () => {
  return {
    h: parseFloat(getInputValue('h')),
    s: parseFloat(getInputValue('s')),
    l: parseFloat(getInputValue('l'))
  };
};

const getRGBInputValues = () => {
  return {
    r: parseInt(getInputValue('r'), 10),
    g: parseInt(getInputValue('g'), 10),
    b: parseInt(getInputValue('b'), 10)
  };
};

const getInputValue = (channel) => {
  return global.wrapper.find(`#color_component_${channel}`).at(0).prop('value');
};

const setInputValue = (channel, value) => {
  const input = global.wrapper.find(`#color_component_${channel}`).at(0);
  input.getDOMNode().value = value;
  input.simulate('change');
};

const selectColorModel = (colorModel) => {
  const input = global.wrapper
    .find(`input[name='color_model[name]'][value='${colorModel}']`)
    .at(0);
  input.simulate('change');
};

export {
  getHexInputValues,
  getHSLInputValues,
  getRGBInputValues,
  getInputValue,
  setInputValue,
  selectColorModel
};
