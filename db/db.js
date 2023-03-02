const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const addMessage = async (customer_id, name, msg) => {
  customer_id = parseInt(customer_id);
  const add = await prisma.messages
    .create({
      data: {
        customer_id: customer_id,
        name: name,
        msg: msg
      }
    })
    .then(res => {
      return true
    })
    .catch(err => {
      console.log(err)
      return false
    })

  return add
}

const getMessages = async customer_id => {
  const results = await prisma.messages
    .findMany({
      where: {
        customer_id: customer_id
      },
      orderBy: {
        createdat: 'asc'
      }
    })
    .then(results => {
      return results
    })
    .catch(err => {
      console.log(err)
      return []
    })

  return results
}

module.exports = {
  createMessage: addMessage,
  getMessages: getMessages
}
