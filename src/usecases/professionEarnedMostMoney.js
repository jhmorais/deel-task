const { Op } = require("sequelize");
const { sequelize, Contract, Profile } = require("../model");

const professionEarnedMostMoney = async (Job, start, end) => {
    try{
        const bestProfession = await Job.findAll({
            attributes: [
                [sequelize.fn('sum', sequelize.col('Job.price')), 'total_received']
            ],
            include:[{
                model: Contract,
                require: true,
                include: [{
                    model: Profile,
                    as: 'Contractor',
                    require: true,
                }]
            }],
            where: {
                paymentDate: {
                    [Op.gte]: new Date(start),
                    [Op.lte]: new Date(end)
                }
            },
            group: ['Contract->Contractor.profession'],
            order: [['total_received', 'DESC']],
            limit: 1
        })

        if(bestProfession.length == 0){
            return { error: true, msg: 'failed, no data was found for this period', status: 404 }
        }

        const result = {
            profession: bestProfession[0].Contract.Contractor.profession,
            earned: bestProfession[0].dataValues.total_received 
        }
        return { error: false, msg: result, status: 200 }
        
    } catch(error) {
        console.log('Error to get professional earned the most money: ', error)
        return { error: true, msg: 'failed to get professional earned the most money', status: 500 }  
    }
}

module.exports = {professionEarnedMostMoney}