import { MongoDayDayTaskRepo } from './implementations/mongoDayDayTaskRepo'
import { MongoScheduledTaskRepo } from './implementations/mongoScheduledTaskRepo'

const dayDayTaskRepo = new MongoDayDayTaskRepo()
const scheduledTaskRepo = new MongoScheduledTaskRepo()

export { dayDayTaskRepo, scheduledTaskRepo }
