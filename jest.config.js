module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../src/$1',
    '^@root/(.*)$': '<rootDir>/../$1',
    '^@config/(.*)$': '<rootDir>/configuration/$1',
    '^@health/(.*)$': '<rootDir>/modules/health/$1',
    '^@common/(.*)$': '<rootDir>/modules/common/$1',
    '^@user/(.*)$': '<rootDir>/modules/user/$1',
    '^@message/(.*)$': '<rootDir>/modules/message/$1',
    '^@iam/(.*)$': '<rootDir>/modules/iam/$1',
  },
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
