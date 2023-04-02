import React from 'react';
import { ComponentPreview, Previews } from '@react-buddy/ide-toolbox';

import LoginPage from '../pages/shared/LoginPage';

import { PaletteTree } from './palette';

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path='/LoginPage'>
        <LoginPage />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
