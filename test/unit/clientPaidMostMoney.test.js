const {clientPaidMostMoney} = require('../../src/usecases/clientPaidMostMoney')
const {Job} = require('../../src/model')

test('list all best clients without limit', async () =>{
    const start = '2000-01-01'
    const end = '2023-12-31'
    const clients = await clientPaidMostMoney(Job, start, end, undefined)
    expect(clients.status).toBe(200)
    expect(clients.msg.length).toBe(2)
})

test('list all best clients with limit', async () =>{
    const start = '2000-01-01'
    const end = '2023-12-31'
    const limit = 3
    const clients = await clientPaidMostMoney(Job, start, end, limit)
    expect(clients.status).toBe(200)
    expect(clients.msg.length).toBe(3)
})

test('list no clients using invalid period', async () =>{
    const start = '1900-01-01'
    const end = '1901-12-31'
    const limit = 3
    const clients = await clientPaidMostMoney(Job, start, end, limit)
    expect(clients.status).toBe(400)
})

test('error on get clients should return internal server error', async () =>{
    const start = '2000-01-01'
    const end = '2023-12-31'
    const limit = 3
    
    const findAllMock = jest.spyOn(Job, "findAll");
    findAllMock.mockImplementation(()=> {
        throw new Error('Error to get clients')
    })
    const clients = await clientPaidMostMoney(Job, start, end, limit)
    findAllMock.mockRestore()
    expect(clients.status).toBe(500)
})