// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const dbName = event.dbName
  const findData = event.findData
  const result = await db.collection(dbName).where(findData)
  return db.collection(dbName).where(findData).get().then(res => {
    console.log(res)
    return res
  })
}