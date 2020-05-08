import cron from 'node-cron'
import axios from 'axios'

// //临时解决定时任务  阿里云的CronJob不给力
// cron.schedule('*/1 * * * *', async () => {
//   const result = await axios.get('http://test-jifenyuedui.ixald.com/api/v1/order/auto/cancel')
//   console.log('每分钟自动执行超时未支付的订单', result.data)
// })

// cron.schedule('*/5 * * * *', async () => {
//   const result = await axios.get('http://test-jifenyuedui.ixald.com/api/v1/scheduleTask')
//   console.log('每5分钟自动执行定时任务', result.data)
// })
