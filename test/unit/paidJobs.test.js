const {payJob} = require('../../src/usecases/payJob')
const {Job, Profile} = require('../../src/model')


test('should return false when the price is greater than the balance value', async() =>{
    const findOneMock = jest.spyOn(Job, "findOne");
    const jobId = 1
    findOneMock.mockImplementation(()=> {
        return {
            id: 1,
            price: 2000,
            Contract: { Client: { balance: 1000 } }
        }
    })
    const result = await payJob(Job, jobId)
    findOneMock.mockRestore()
    expect(result).toBe(false)
})

test('should return true when the price is less than the balance value', async() =>{
    const findOneMock = jest.spyOn(Job, "findOne");
    const updateJobMock = jest.spyOn(Job, "update");
    const updateProfileMock = jest.spyOn(Profile, "update");
    const jobId = 1
    updateJobMock.mockImplementation(() => { return null })
    updateProfileMock.mockImplementation(() => { return null })
    findOneMock.mockImplementation(()=> {
        return {
            id: 1,
            price: 200,
            Contract: { Client: { balance: 1000 }, Contractor: { balance: 800 } }
        }
    })
    const result = await payJob(Job, jobId)
    findOneMock.mockRestore()
    updateProfileMock.mockRestore()
    updateJobMock.mockRestore()
    expect(result).toBe(true)
})

test('error on update job should return internal server error', async () =>{
    const updateJobMock = jest.spyOn(Job, "update");
    const jobId = 1
    updateJobMock.mockImplementation(()=> {
        throw new Error('Error to update job')
    })
    const result = await payJob(Job, jobId)
    updateJobMock.mockRestore()

    expect(result).toBe(false)
})