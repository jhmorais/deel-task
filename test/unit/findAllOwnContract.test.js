const {findAllOwnContract} = require('../../src/usecases/findAllOwnContract')
const {Contract} = require('../../src/model')

test('list all contract of valid profile', async () => {
    const profile = {id: 1}
    const result = await findAllOwnContract(Contract, profile)
    expect(result.length).toBe(1)
})

test('failed to list contracts of invalid profile', async () => {
    const profile = {id: 0}
    const result = await findAllOwnContract(Contract, profile)

    expect(result.length).toBe(0)
})

test('error on list contracts should retun internal server error', async () => {
    const profile = {id: 1}
    const findAllMock = jest.spyOn(Contract, "findAll");
    findAllMock.mockImplementation(()=> {
        throw new Error('Error to get contracts')
    })
    const result = await findAllOwnContract(Contract, profile)
    findAllMock.mockRestore()

    expect(result).toBe(null)
})
