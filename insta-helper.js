module.exports = {
    getElementByXpath: async (page, xpath, elementIndex = 0) => {
        try {
            const element = await page.$x(xpath);
            let text = await page.evaluate(text => text.textContent, element[elementIndex]);
            return text;
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}