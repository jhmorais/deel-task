const deposit = async (Profile, userId, amount) => {
    const client = await Profile.findOne({
        where: { id: userId }
    })

    if(amount > (client.balance * 0.25)){
        return { error: true, msg: 'amount is greater than 25% of client balance', status: 400 }
    }
    try{
        const newBalance = amount + client.balance
        await Profile.update({ balance: newBalance, updateAt: new Date().toString() }, { where: { id: userId } })
    } catch(error){
        console.log('Error to update client: ', error)
        return { error: true, msg: 'failed to update client', status: 500 }
    }

    return { error: false, msg: 'deposited with success', status: 200 }
}

module.exports = {deposit}