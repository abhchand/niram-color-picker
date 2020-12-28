import ColorEditor from 'components/color-editor';
import ColorExport from 'components/color-export';
import ColorGrid from 'components/color-grid';
import React from 'react';
import ReactDom from 'react-dom';

/*
 * Order matters -`<ColorGrid />` emits events to other components
 * on mount, so ensure other components are initialized first so
 * they are ready to receive events
 */
ReactDom.render(
  <ColorEditor />,
  document.getElementById('color-editor-component')
);
ReactDom.render(
  <ColorExport />,
  document.getElementById('color-export-component')
);
ReactDom.render(<ColorGrid />, document.getElementById('color-grid-component'));
