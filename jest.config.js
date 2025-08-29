/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 100000,
    testRegex: "__tests__/.*test.*\\.ts$",
    // testRegex: "__tests__/(e2e|integration|unit)/.*test.*\\.ts$", // Учитываем оба каталога
}
// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//     projects: [
//         '<rootDir>/jest.e2e.config.js',
//         '<rootDir>/jest.integration.config.js',
//     ],
// };