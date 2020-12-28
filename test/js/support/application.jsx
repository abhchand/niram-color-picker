import ColorEditor from 'components/color-editor';
import ColorExport from 'components/color-export';
import ColorGrid from 'components/color-grid';
import { mount } from 'enzyme';
import React from 'react';

const renderApplication = () => {
  // Create a container in the DOM to attach to
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Create a containing component that renders all components
  function App(_props) {
    return (
      <div id='color-component'>
        <div id='color-editor-component'>
          <ColorEditor />
        </div>
        <div id='color-export-component'>
          <ColorGrid />
        </div>
        <div id='color-grid-component'>
          <ColorExport />
        </div>
      </div>
    );
  }

  global.wrapper = mount(<App />, { attachTo: container });
};

export { renderApplication };
