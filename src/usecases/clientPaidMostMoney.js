const { Op } = require("sequelize");
const { sequelize, Contract, Profile } = require("../model");

const clientPaidMostMoney = async (Job, start, end, limit=2) => {
    try{
        const bestClients = await Job.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('Job.price')), 'paid']
            ],
            include:[{
                model: Contract,
                require: true,
                include: [{
                    model: Profile,
                    as: 'Client',
                    require: true,
                }]
            }],
            where: {
                paymentDate: {
                    [Op.gte]: new Date(start),
                    [Op.lte]: new Date(end)
                }
            },
            group: ['Contract->Client.id', 'Contract->Client.firstName', 'Contract->Client.lastName'],
            order: [['paid', 'DESC']],
            limit
        })

        if(bestClients.length == 0){
            return { error: true, msg: 'failed, no data was found for this period', status: 400 }
        }

        const result = []
        
        for(client of bestClients){
            result.push({
                id: client.Contract.Client.id,
                fullName: `${client.Contract.Client.firstName} ${client.Contract.Client.lastName}`,
                paid: client.dataValues.paid 
            })
        }
        return { error: false, msg: result, status: 200 }
        
    } catch(error) {
        console.log('Error to get client paid the most money: ', error)
        return { error: true, msg: 'failed to get client paid the most money', status: 500 }
    }
}

module.exports = {clientPaidMostMoney}