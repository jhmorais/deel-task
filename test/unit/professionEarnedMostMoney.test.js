const {professionEarnedMostMoney} = require('../../src/usecases/professionEarnedMostMoney')
const {Job} = require('../../src/model')

test('get the best professional', async () =>{
    const start = '2020-01-01'
    const end = '2023-31-12'
    const result = await professionEarnedMostMoney(Job, start, end)

    expect(result.msg.profession).toBe('Programmer')
})

test('return no professional for invalid period', async () =>{
    const start = '2024-01-01'
    const end = '2023-31-12'
    const result = await professionEarnedMostMoney(Job, start, end)

    expect(result.msg).toBe('failed, no data was found for this period')
    expect(result.status).toBe(404)
})

test('error on get profession should return internal server error', async () =>{
    const start = '2020-01-01'
    const end = '2023-31-12'
    const findAllMock = jest.spyOn(Job, "findAll");
    findAllMock.mockImplementation(()=> {
        throw new Error('Error to get profession')
    })
    const result = await professionEarnedMostMoney(Job, start, end)
    findAllMock.mockRestore()

    expect(result.status).toBe(500)
})