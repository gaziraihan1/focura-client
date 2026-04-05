import React from 'react';
import { render } from '@testing-library/react';

// Define a custom render function that adds additional context if necessary
const customRender = (ui, { providerProps, ...renderOptions } = {}) => {
  // Add any context providers here if needed
  return render(ui, { ...renderOptions });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Our custom render function
export { customRender };