import ColorModelSelector from 'components/color-model-selector';
import CopyToClipboard from 'components/copy-to-clipboard';
import PropTypes from 'prop-types';
import React from 'react';
import { toScss } from './scss';

class ExportModal extends React.Component {
  static propTypes = {
    gradients: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.setColorModel = this.setColorModel.bind(this);

    this.state = {
      colorModel: 'rgb'
    };
  }

  setColorModel(newColorModel) {
    this.setState({
      colorModel: newColorModel
    });
  }

  render() {
    const { gradients } = this.props;
    const { colorModel } = this.state;

    const scss = toScss(gradients, colorModel);

    return (
      <div className='color-export__modal modal'>
        <div className='modal-content'>
          <ColorModelSelector
            colorModel={this.state.colorModel}
            setColorModel={this.setColorModel}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: scss.split('\n').join('<br />')
            }}
            className='color-export__scss'></div>
          <CopyToClipboard text={scss} fallbackOnPrompt={false} />
          <button onClick={this.props.closeModal} className='button--hollow'>CLOSE</button>
        </div>
      </div>
    );
  }
}

export default ExportModal;
