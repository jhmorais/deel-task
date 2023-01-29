const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
const {findOwnContract} = require('./usecases/findOwnContract')
const {findAllOwnContract} = require('./usecases/findAllOwnContract')
const {findUnpaidJobs} = require('./usecases/findUnpaidJobs')
const {payJob} = require('./usecases/payJob')
const {deposit} = require('./usecases/deposit');
const { professionEarnedMostMoney } = require('./usecases/professionEarnedMostMoney');
const { clientPaidMostMoney } = require('./usecases/clientPaidMostMoney');
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)


/**
 * @returns contract by id
 */
app.get('/contracts/:id',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const {id} = req.params
    const profile = req.profile.dataValues
    const contract = await findOwnContract(Contract, id, profile)
    if(!contract) return res.status(404).end()
    res.json(contract)
})

/**
 * @returns all contracts from profile with status new or in_progress
 */
app.get('/contracts',getProfile ,async (req, res) =>{
    const {Contract} = req.app.get('models')
    const profile = req.profile.dataValues
    const contract = await findAllOwnContract(Contract, profile)
    if(!contract) return res.status(404).end()
    res.json(contract)
})

/**
 * @returns all unpaid jobs for a user
 */
app.get('/jobs/unpaid',getProfile ,async (req, res) =>{
    const {Job} = req.app.get('models')
    const profile = req.profile.dataValues
    const jobs = await findUnpaidJobs(Job, profile)
    if(!jobs) return res.status(404).end()
    res.json(jobs)
})

/**
 * @returns void
 */
app.post('/jobs/:job_id/pay',getProfile ,async (req, res) =>{
    const {Job} = req.app.get('models')
    const {job_id} = req.params
    const jobs = await payJob(Job, job_id)
    if(!jobs) return res.status(404).end()
    res.status(200).end()
})

/**
 * @returns void
 */
app.post('/balances/deposit/:userId',getProfile ,async (req, res) =>{
    const {Profile} = req.app.get('models')
    const {userId} = req.params
    const {amount} = req.body
    const result = await deposit(Profile, userId, amount)
    return res.status(result.status).json({ msg: result.msg }).end()
})

/**
 * @returns void
 */
app.get('/admin/best-profession',getProfile ,async (req, res) =>{
    const {Job} = req.app.get('models')
        const {start, end} = req.query
    const result = await professionEarnedMostMoney(Job, start, end)
    if(result.error) return res.status(result.status).json({ msg: result.msg }).end()
    return res.status(result.status).json(result.msg).end()
})

/**
 * @returns void
 */
app.get('/admin/best-clients',getProfile ,async (req, res) =>{
    let {start, end, limit} = req.query
    if(limit === '') limit = undefined
    const {Job} = req.app.get('models')
    const result = await clientPaidMostMoney(Job, start, end, limit)
    if(result.error) return res.status(result.status).json({ msg: result.msg }).end()
    return res.status(result.status).json(result.msg).end()
})


module.exports = app;
