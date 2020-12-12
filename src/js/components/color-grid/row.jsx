import ColorCell from './color-cell';
import PropTypes from 'prop-types';
import React from 'react';
import RefreshIcon from 'components/icons/refresh';

class Row extends React.Component {
  static propTypes = {
    gradient: PropTypes.object.isRequired,
    gradientIdx: PropTypes.number.isRequired,
    gradientType: PropTypes.string.isRequired,
    selectedIdx: PropTypes.number.isRequired,
    refreshGradient: PropTypes.func.isRequired,
    selectColor: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.label = this.label.bind(this);
    this.onClickRefreshButton = this.onClickRefreshButton.bind(this);
  }

  label() {
    const { gradientIdx, gradientType } = this.props;

    switch (gradientType) {
      case 'primary':
        return 'Primary';
        break;

      case 'neutral':
        return 'Neutral';
        break;

      case 'accent':
        return gradientIdx === 0 ? 'Accents' : null;
        break;

      default:
        return 'Unknown';
    }
  }

  onClickRefreshButton() {
    const { gradientIdx, gradientType } = this.props;
    this.props.refreshGradient(gradientType, gradientIdx);
  }

  render() {
    const {
      gradient,
      gradientType,
      gradientIdx,
      selectedIdx,
      selectColor
    } = this.props;

    return (
      <tr
        className='color-grid__row'
        data-type={gradientType}
        data-id={gradientIdx}>
        <td className='label'>{this.label()}</td>
        {gradient.map((hslColor, positionIdx) => {
          return (
            <td
              key={`gradient-${gradientType}-${gradientIdx}-${positionIdx}`}
              data-id={(positionIdx + 1) * 100}>
              <ColorCell
                hslColor={hslColor}
                isSelected={selectedIdx > -1 && selectedIdx === positionIdx}
                onClick={(_e) => selectColor(positionIdx)}
              />
            </td>
          );
        })}
        <td className='refresh'>
          <button
            className={'button--icon'}
            onClick={this.onClickRefreshButton}>
            <RefreshIcon fillColor={'#250E62'} />
          </button>
        </td>
      </tr>
    );
  }
}

export default Row;
