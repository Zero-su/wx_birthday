// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const dbName = event.dbName
  let updateData = event.updateData
  const _id = updateData._id
  delete updateData._id
  const result = await db.collection(dbName).doc(_id).update({
    data: updateData
  })
  return result
}