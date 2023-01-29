const { Op } = require("sequelize");

const findAllOwnContract = async (Contract, profile) => {
    try{
        const contracts = await Contract.findAll({
            attributes: ['terms', 'status', 'createdAt', 'updatedAt', 'ContractorId', 'ClientId'],
            where: { 
                status: {
                    [Op.notLike]: 'terminated'
                },
                [Op.or]: [
                    {ContractorId: profile.id},
                    {ClientId: profile.id}
                ]
            }
        })
        return contracts
    } catch(error) {
        console.log('Error to get all own contracts: ', error)
        return null
    }
}

module.exports = {findAllOwnContract}