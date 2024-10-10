import { diff } from 'jest-diff'

declare global {
    namespace jest {
        interface Matchers<R> {
            toEqualExcludingFields(expected: any, fieldsToExclude: string[]): R
        }
    }
}

function omitFields(obj: any, fields: string[]): any {
    if (Array.isArray(obj)) {
        return obj.map(item => omitFields(item, fields))
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {}
        for (const key in obj) {
            if (!fields.includes(key)) {
                newObj[key] = omitFields(obj[key], fields)
            }
        }
        return newObj
    }
    return obj
}

expect.extend({
    toEqualExcludingFields(received: any, expected: any, fieldsToExclude: string[]) {
        const receivedWithoutFields = omitFields(received, fieldsToExclude)
        const expectedWithoutFields = omitFields(expected, fieldsToExclude)

        const pass = this.equals(receivedWithoutFields, expectedWithoutFields)

        const message = pass
            ? () => this.utils.matcherHint('.not.toEqualExcludingFields') +
                '\n\n' +
                `Expected value to not equal (excluding fields ${fieldsToExclude}):\n` +
                `  ${this.utils.printExpected(expectedWithoutFields)}\n` +
                `Received:\n` +
                `  ${this.utils.printReceived(receivedWithoutFields)}`
            : () => {
                const diffString = diff(expectedWithoutFields, receivedWithoutFields, {
                    expand: this.expand,
                });
                return this.utils.matcherHint('.toEqualExcludingFields') +
                    '\n\n' +
                    `Expected value to equal (excluding fields ${fieldsToExclude}):\n` +
                    `  ${this.utils.printExpected(expectedWithoutFields)}\n` +
                    `Received:\n` +
                    `  ${this.utils.printReceived(receivedWithoutFields)}\n\n` +
                    (diffString ? `Difference:\n\n${diffString}` : '')
            };

        return { actual: received, message, pass }
    }
})