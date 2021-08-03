describe('OpenPGP', () => {
    const timeout = 1000 * 60
    const input = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras orci ex, pellentesque quis lobortis in";
    const list = by.id('list')

    beforeAll(async () => {
        await device.launchApp({delete: true, newInstance: false});
        await waitFor(element(list)).toExist().withTimeout(timeout);
        await device.reloadReactNative();
    });

    describe('Encrypt and Decrypt', () => {
        const parent = by.id('encrypt-decrypt').withAncestor(list);

        it('Encrypt', async () => {
            const container = by.id('encrypt').withAncestor(parent);

            const message = by.id('message').withAncestor(container);
            const button = by.id('button').withAncestor(container);
            const result = by.id('result').withAncestor(container);
            await element(message).replaceText(input)
            await element(button).tap()

            await waitFor(element(result)).toExist().withTimeout(timeout);

            await expect(element(result)).not.toHaveText('')

        });

        it('Decrypt', async () => {
            const container = by.id('decrypt').withAncestor(parent);

            const button = by.id('button').withAncestor(container);
            const result = by.id('result').withAncestor(container);
            await element(button).tap()

            await waitFor(element(result)).toExist().withTimeout(timeout);

            await expect(element(result)).toHaveText(input)

        });

    });

});
