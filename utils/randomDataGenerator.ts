import { faker } from '@faker-js/faker';

export class RandomDataUtil {

static getFirstName()
{
    return faker.person.firstName();
}

static getLastName()
{
    return faker.person.lastName();
}
 static getEmail()
 {
    return faker.internet.email();
 }

 static getPhoneNumber()
{
        return faker.phone.number();
}

static getRandomAddress()
{
    return faker.location.streetAddress();
}

static getRandomPassword( length: number = 10):string
{
     return faker.internet.password({length: length});
}

static getRandomUsername(length: number = 8): string 
{
 return faker.string.alphanumeric(length);
}


}