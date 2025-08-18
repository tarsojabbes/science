beforeEach(() => {
  delete process.env.JWT_SECRET;
});

global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};