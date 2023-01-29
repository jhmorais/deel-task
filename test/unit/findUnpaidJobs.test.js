const {findUnpaidJobs} = require('../../src/usecases/findUnpaidJobs')
const {Job} = require('../../src/model')

test('list all unpaid jobs from profile', async() => {
    const profile = {id:6}
    const result = await findUnpaidJobs(Job, profile)
    expect(result.length).toBe(2)
})

test('list no contracts from invalid profile', async() => {
    const profile = {id:-60}
    const result = await findUnpaidJobs(Job, profile)
    expect(result.length).toBe(0)
})

test('error to get unpaid job should retun internal server error', async() => {
    const profile = {id:6}
    const findAllMock = jest.spyOn(Job, "findAll");
    findAllMock.mockImplementation(()=> {
        throw new Error('Error to get jobs')
    })
    const result = await findUnpaidJobs(Job, profile)
    findAllMock.mockRestore()
    expect(result).toBe(null)
})