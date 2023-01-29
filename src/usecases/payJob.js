const { Op } = require("sequelize");
const { sequelize } = require("../model");
const { Profile } = require("../model");
const { Contract } = require("../model");

const payJob = async (Job, jobId) => {
    
    const job = await Job.findOne({
        include: [{
            model: Contract,
            require: true,
            include: [{
                model: Profile,
                as: 'Client',
                require: true
            }, {
                model: Profile,
                as: 'Contractor',
                require: true
            }]
        }],
        where: { id: jobId, paid: { [Op.is]: null } }
    })

    if(job?.Contract?.Client?.balance >= job?.price){
        const transaction = await sequelize.transaction()
        try {
            const clientBalance = job.Contract.Client.balance - job.price
            const contractoBalance = job.Contract.Contractor.balance + job.price
            const today = new Date().toString()
            await Job.update({ paid: 1, paymentDate: today, updateAt: today },
                { where: { id: jobId } }, transaction
            )

            await Profile.update({ balance: clientBalance, updateAt: today },
                { where: { id: job.Contract.Client.id } }, transaction
            )

            await Profile.update({ balance: contractoBalance, updateAt: today },
                { where: { id: job.Contract.Contractor.id } }, transaction
            )

            await transaction.commit()
            return true

        } catch(error) {
            console.log('Update failed: ', error)
            if(transaction) {
                await transaction.rollback();
            }
        }
    }
    return false
}

module.exports = {payJob}