const {deposit} = require('../../src/usecases/deposit')
const {Profile} = require('../../src/model')
const findOneMock = jest.spyOn(Profile, "findOne");

beforeAll(() => {
    findOneMock.mockImplementation(() => {
        return {
            id: 1,
            firstName: 'John',
            lastName: 'Due',
            profession: 'Fighter',
            balance: 999,
            type: 'Client',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02'
        }
    })
})

afterAll(() => {
    findOneMock.mockRestore()
});

test('deposit value less than client balance', async () => {
    const userId = 1
    const amount = 20
    
    const result = await deposit(Profile, userId, amount)
    expect(result.status).toBe(200)
})

test('deposit value greater than client balance', async () => {
    const userId = 1
    const amount = 2000
    
    const result = await deposit(Profile, userId, amount)
    expect(result.status).toBe(400)
})

test('deposit will fail', async () => {
    const userId = 1
    const amount = 100
    const update = jest.spyOn(Profile, "update")

    update.mockImplementation(() => {
        throw new Error('Error to update')
    })
    const result = await deposit(Profile, userId, amount)
    update.mockRestore()
    
    expect(result.status).toBe(500)
})