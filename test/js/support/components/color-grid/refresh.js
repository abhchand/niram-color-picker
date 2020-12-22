const clickGradientRefreshBtn = (gradientType, gradientIdx) => {
  /*
   * The data-*-idx values are integers, so the query selector
   * should not have surrounding quotes.
   *
   * See: https://github.com/enzymejs/enzyme/blob/master/docs/api/selector.md#1-a-valid-css-selector
   */
  const row = global.wrapper
    .find(
      `tr[data-gradient-type='${gradientType}'][data-gradient-idx=${gradientIdx}]`
    )
    .at(0);

  row.find('td.refresh > button').at(0).simulate('click');
};

export { clickGradientRefreshBtn };
