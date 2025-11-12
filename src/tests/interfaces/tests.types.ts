/* eslint-disable prettier/prettier */


export type User = {
    id: number,
    name: string,
    email: string,
    address: {
        street: Lowercase<string>,
        city: Uppercase<string>,
        zipCode: Readonly<NonNullable<number>>,
        no: Required<number | undefined | null>,
        township: Capitalize<string>
    }
}

const testUser: User = {
    id: 1,
    email: 'aung@123',
    name: 'aung',
    address: {
        street: 'asdfas',
        city: 'YGN',
        zipCode: 123123,
        no: null,
        township: 'Thuwunna'
    }
}

export const createUser = (user: Record<'myUser', User>) => {
    const test: Record<string, User> = {
        'myUser': testUser
    };
    return test?.['myUser'];
}

export type UserReturnType = ReturnType<typeof createUser>
export type UserParameterType = Parameters<typeof createUser>