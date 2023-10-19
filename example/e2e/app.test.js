describe('OpenPGP', () => {
  const timeout = 1000 * 60;
  const dyScroll = 100.0;
  const input =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras orci ex, pellentesque quis lobortis in';
  const list = by.id('list');

  scrollTo = (container) => {
    return waitFor(element(container))
      .toBeVisible()
      .whileElement(list)
      .scroll(dyScroll, 'down')
    

  };

  beforeAll(async () => {
    await device.launchApp();
    await device.reloadReactNative();
    await waitFor(element(list)).toExist().withTimeout(timeout);
  });

  describe('Encrypt and Decrypt', () => {
    const parent = by.id('encrypt-decrypt').withAncestor(list);

    it('Encrypt', async () => {
      const container = by.id('encrypt').withAncestor(parent);
      await scrollTo(container);

      const message = by.id('message').withAncestor(container);
      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(message);
      await element(message).replaceText(input);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).not.toHaveText('');
    });

    it('Decrypt', async () => {
      const container = by.id('decrypt').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).toHaveText(input);
    });
  });

  describe('Encrypt and Decrypt File', () => {
    const parent = by.id('encrypt-decrypt-file').withAncestor(list);

    it('Encrypt', async () => {
      const container = by.id('encrypt').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).not.toHaveText('');
    });

    it('Decrypt', async () => {
      const container = by.id('decrypt').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).toHaveText('sample');
    });
  });

  describe('Encrypt and Decrypt Symmetric', () => {
    const parent = by.id('encrypt-decrypt-symmetric').withAncestor(list);

    it('Encrypt', async () => {
      const container = by.id('encrypt').withAncestor(parent);
      await scrollTo(container);

      const message = by.id('message').withAncestor(container);
      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(message);
      await element(message).replaceText(input);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).not.toHaveText('');
    });

    it('Decrypt', async () => {
      const container = by.id('decrypt').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).toHaveText(input);
    });
  });

  describe('Encrypt and Decrypt Symmetric File', () => {
    const parent = by.id('encrypt-decrypt-symmetric-file').withAncestor(list);

    it('Encrypt', async () => {
      const container = by.id('encrypt').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).not.toHaveText('');
    });

    it('Decrypt', async () => {
      const container = by.id('decrypt').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).toHaveText('sample');
    });
  });

  describe('Sign and Verify', () => {
    const parent = by.id('sign-verify').withAncestor(list);

    it('Sign', async () => {
      const container = by.id('sign').withAncestor(parent);
      await scrollTo(container);

      const message = by.id('message').withAncestor(container);
      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(message);
      await element(message).replaceText(input);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).not.toHaveText('');
    });

    it('Verify', async () => {
      const container = by.id('verify').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).toHaveText('valid');
    });
  });

  describe('Sign and Verify File', () => {
    const parent = by.id('sign-verify-file').withAncestor(list);

    it('Sign', async () => {
      const container = by.id('sign').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).not.toHaveText('');
    });

    it('Verify', async () => {
      const container = by.id('verify').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      const result = by.id('result').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      await waitFor(element(result)).toExist().withTimeout(timeout);
      await expect(element(result)).toHaveText('valid');
    });
  });

  describe('Generate', () => {
    const parent = by.id('generate').withAncestor(list);

    it('Generate', async () => {
      const container = by.id('generator').withAncestor(parent);
      await scrollTo(container);

      const button = by.id('button').withAncestor(container);
      await scrollTo(button);
      await element(button).tap();

      const publicKey = by.id('publicKey').withAncestor(container);
      await waitFor(element(publicKey)).toExist().withTimeout(timeout);
      await expect(element(publicKey)).not.toHaveText('');

      const privateKey = by.id('privateKey').withAncestor(container);
      await waitFor(element(privateKey)).toExist().withTimeout(timeout);
      await expect(element(privateKey)).not.toHaveText('');
    });
  });
});
