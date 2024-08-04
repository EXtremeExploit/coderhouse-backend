import { faker } from '@faker-js/faker';

export function generateProduct() {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({ min: 1, max: 100 }),
        code: faker.number.int({ max: 1000 }),
        price: faker.commerce.price(),
        thumbnails: faker.image.url(),
        category: faker.commerce.productAdjective(),
        status: faker.datatype.boolean(0.75),
    };
};
