describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({ delete: true, newInstance: false });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await waitFor(element(by.id('welcome')))
      .toExist()
      .withTimeout(1000 * 60);
    await expect(element(by.id('welcome'))).toBeVisible();
  });
});
