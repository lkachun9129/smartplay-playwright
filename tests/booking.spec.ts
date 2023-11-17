import { test } from '@playwright/test';

const MAX_PROFILE_COUNT = 3;

const SELECTED_PROFILES = ['Tennis-TW', 'Tennis-ST', 'Tennis-MF'];

const USER_ID = ''

const PASSWORD = '';

test.describe('booking', () => {

    test('iamsmart', async ({ page }) => {
        // landing page
        await page.goto('https://www.smartplay.lcsd.gov.hk/home');
        await page.getByLabel('智方便登入').waitFor();
        await page.getByLabel('智方便登入').click();

        // await iAMSamrt authentication
        await page.getByRole('img', { name: '以智方便手機應用程式掃瞄此二維碼以登入' }).waitFor();

        // reached welcome page
        await page.getByLabel('設施').waitFor();
        await page.getByLabel('設施').click();

        let profileOrders: number[] = [];

        await page.locator('.el-loading-mask').waitFor({ state: 'hidden' });

        // lookup profile ordering
        for (let idx = 0; idx < MAX_PROFILE_COUNT; idx++) {
            let profile = await page.locator('div:nth-child(2) > .smart-play-pc-tablet > div').nth(idx).locator('div.head > div:nth-child(1)').innerText();
            let pos = SELECTED_PROFILES.indexOf(profile);
            if (pos >= 0) {
                profileOrders[pos] = idx;
            }
        }

        let full = true;

        // book by selected profiles
        for (const pos of profileOrders) {
            let locator = page.locator('div:nth-child(2) > .smart-play-pc-tablet > div').nth(pos);
            let profile = await locator.locator('div.head > div:nth-child(1)').innerText();
            console.log(`Booking with ${profile}`);
            await locator.getByText('立即預訂').click();

            // wait for reservation request to finish
            await page.locator('.el-loading-mask').waitFor({ state: 'hidden' });

            if (await page.getByText('所選日子暫時未能接受預訂').isVisible()) {
                // fail to book and proceed to next profile
                await page.getByText('關閉').click();
            } else {
                // success
                full = false;
                break;
            }
        }

        if (!full) {
            // review details before payment
            await page.getByText('是否需要預訂其他設施？').waitFor();
            await page.getByText('否', { exact: true }).click();
            console.error('Booking succeeded.');
        } else {
            // booking failed
            console.error('All booking failed.');
        }
    });


    test('legacy', async ({ page }) => {
        // landing page
        await page.goto('https://www.smartplay.lcsd.gov.hk/home');
        await page.getByLabel('SmartPLAY用戶帳號或別名').waitFor();
        await page.getByLabel('SmartPLAY用戶帳號或別名').fill(USER_ID);
        await page.getByLabel('密碼').waitFor();
        await page.getByLabel('密碼').fill(PASSWORD);
        await page.getByRole('button', { name: '登錄' }).click();

        // reached welcome page
        await page.getByLabel('設施').waitFor();
        await page.getByLabel('設施').click();

        let profileOrders: number[] = [];

        await page.locator('.el-loading-mask').waitFor({ state: 'hidden' });

        // lookup profile ordering
        for (let idx = 0; idx < MAX_PROFILE_COUNT; idx++) {
            let profile = await page.locator('div:nth-child(2) > .smart-play-pc-tablet > div').nth(idx).locator('div.head > div:nth-child(1)').innerText();
            let pos = SELECTED_PROFILES.indexOf(profile);
            if (pos >= 0) {
                profileOrders[pos] = idx;
            }
        }

        let full = true;

        // book by selected profiles
        for (const pos of profileOrders) {
            let locator = page.locator('div:nth-child(2) > .smart-play-pc-tablet > div').nth(pos);
            let profile = await locator.locator('div.head > div:nth-child(1)').innerText();
            console.log(`Booking with ${profile}`);
            await locator.getByText('立即預訂').click();

            // wait for reservation request to finish
            await page.locator('.el-loading-mask').waitFor({ state: 'hidden' });

            if (await page.getByText('所選日子暫時未能接受預訂').isVisible()) {
                // fail to book and proceed to next profile
                await page.getByText('關閉').click();
            } else {
                // success
                full = false;
                break;
            }
        }

        if (!full) {
            // review details before payment
            await page.getByText('是否需要預訂其他設施？').waitFor();
            await page.getByText('否', { exact: true }).click();
            console.error('Booking succeeded.');
        } else {
            // booking failed
            console.error('All booking failed.');
        }
    });
});
