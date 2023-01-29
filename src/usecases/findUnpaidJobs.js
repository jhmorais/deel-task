const { Op } = require("sequelize");
const { Contract } = require("../model");

const findUnpaidJobs = async (Job, profile) => {
    try{
        const jobs = await Job.findAll({
            attributes: ['description', 'price', 'paid', 'paymentDate', 'createdAt', 'updatedAt', 'ContractId'],
            include: [{
                model: Contract,
                require: true,
                attributes: [],
                where: {
                    status: {
                        [Op.like]: 'in_progress'
                    },
                    [Op.or]: [
                        {ContractorId: profile.id},
                        {ClientId: profile.id}
                    ]
                }
            }],
            where: {
                paid: { [Op.is]: null }
            }
        })

        return jobs
    } catch (error) {
        console.log('Error to get unpaid jobs: ', error)
        return null
    }
}

module.exports = {findUnpaidJobs}