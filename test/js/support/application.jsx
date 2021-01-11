import ColorEditor from 'components/color-editor';
import ColorExport from 'components/color-export';
import ColorGrid from 'components/color-grid';
import { mount } from 'enzyme';
import React from 'react';
import ReactDom from 'react-dom';

const renderApplication = () => {
  // Create a container in the DOM to attach to
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Create a containing component that renders all components
  function App(_props) {
    return (
      <div id='color-component'>
        <div id='color-editor-component'></div>
        <div id='color-grid-component'></div>
        <div id='color-export-component'></div>
      </div>
    );
  }

  global.wrapper = mount(<App />, { attachTo: container });

  mount(
    <ColorEditor />,
    { attachTo: document.getElementById('color-editor-component') }
  );
  mount(
    <ColorExport />,
    { attachTo: document.getElementById('color-export-component') }
  );
  mount(
    <ColorGrid />,
    { attachTo: document.getElementById('color-grid-component') }
  );

  global.wrapper.update();
};

export { renderApplication };
