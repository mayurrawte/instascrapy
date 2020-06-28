module.exports = {
    getElementByXpath: async (page, xpath, elementIndex = 0) => {
        const element = await page.$x(xpath);
        let text = await page.evaluate(text => text.textContent, element[elementIndex]);
        return text;
    }
}