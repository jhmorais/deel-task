const { Op } = require("sequelize");

const findOwnContract = async (Contract, id, profile) => {
    try{
        const contract = await Contract.findOne({
            attributes: ['terms', 'status', 'createdAt', 'updatedAt', 'ContractorId', 'ClientId'],
            where: {
                id,
                [Op.or]: [
                    {ContractorId: profile.id},
                    {ClientId: profile.id}
                ]
            }
        })

        return contract
    } catch(error) {
        console.log('Error to get contract: ', error)
        return null
    }
}

module.exports = {findOwnContract}