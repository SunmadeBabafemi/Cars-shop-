// this file is created to ensure that the test database is alwasys deleted right before each test is run

import { rm } from 'fs/promises'
import { join } from 'path'
import { getConnection} from 'typeorm'

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite')) 
    } catch (error) {
        
    }
})

// typeorm needs to disconnect from the database each time the database 
// is deleted so the tests would not encounter an error
global.afterEach(async () => {
    const conn = getConnection()
    await conn.close()
})