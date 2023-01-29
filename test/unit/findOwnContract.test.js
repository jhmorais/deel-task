const {findOwnContract} = require('../../src/usecases/findOwnContract')
const {Contract} = require('../../src/model')

test('get contract of valid profile', async () =>{
    const id = 1
    const profile = {id: 5}
    const result = await findOwnContract(Contract, id, profile)
    expect(result).not.toBe(null)
})

test('return undefined for invalid profile', async () =>{
    const id = 1
    const profile = {id: -50}
    const result = await findOwnContract(Contract, id, profile)
    expect(result).toBe(null)
})


test('error to get contract should retun internal server error', async () => {
    const id = 1
    const profile = {id: 5}
    const findOneMock = jest.spyOn(Contract, "findOne");
    findOneMock.mockImplementation(()=> {
        throw new Error('Error to get contract')
    })
    const result = await findOwnContract(Contract, id, profile)
    findOneMock.mockRestore()

    expect(result).toBe(null)
})