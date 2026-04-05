'use strict';

// Testing Library Setup
import '@testing-library/jest-dom/extend-expect';

// Next Router Mock
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Next Auth Mock
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    session: null,
    status: 'unauthenticated',
  }),
}));

// Next Image Mock
jest.mock('next/image', () => {
  const Image = (props) => {
    return <img {...props} />;
  };
  Image.displayName = 'Image';
  return Image;
});

// Console Error Suppression
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('Warning: An update to')) return;
  originalError.call(console, ...args);
};