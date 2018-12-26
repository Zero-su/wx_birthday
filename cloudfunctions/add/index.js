// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const dbName = event.dbName
  const addData = event.addData
  const result = await db.collection(dbName).add({
    data: addData
  })
  return result
}