import { COLOR_GRID_UPDATED } from 'components/event-bus/events';
import eventBus from 'components/event-bus';
import ExportModal from './export-modal';
import PropTypes from 'prop-types';
import React from 'react';

class ColorExport extends React.Component {
  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModal = this.renderModal.bind(this);

    this.eventUnsubscribes = [];

    this.state = {
      isModalOpen: false,
      gradients: null
    };
  }

  componentDidMount() {
    const unsubscribe = eventBus.on(COLOR_GRID_UPDATED, (newColorGrid) =>
      this.setState({ gradients: newColorGrid })
    );

    this.eventUnsubscribes.push(unsubscribe);
  }

  componentWillUnmount() {
    this.eventUnsubscribes.forEach((u) => u());
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  renderModal() {
    const { gradients, isModalOpen } = this.state;

    if (!isModalOpen) {
      return null;
    }

    return <ExportModal gradients={gradients} closeModal={this.closeModal} />;
  }

  render() {
    if (this.state.gradients === null) {
      return null;
    }

    return (
      <div className='color-export'>
        <button className='color-export__export' onClick={this.openModal}>
          EXPORT CSS →
        </button>
        {this.renderModal()}
      </div>
    );
  }
}

export default ColorExport;
