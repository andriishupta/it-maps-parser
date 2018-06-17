import { createServer, container as iocContainer } from '../lib/server'
import { env } from '../lib/env'
import { logger } from '../lib/logger'

import Confirm from 'prompt-confirm'
import mongoose from 'mongoose'

createServer().then(
  app =>
    app.listen(env.PORT, async () => {
      const mode = env.NODE_ENV
      logger.debug(`Server listening on ${env.PORT} in ${mode} mode`)

      logger.debug(`Connecting to db: ${env.DB}`)
      mongoose.connect(`mongodb://localhost/${env.DB}`)

      const db = mongoose.connection
      db.on('error', err => {
        logger.error(`Connection error: ${err}`)
        process.exit(1)
      })

      const success = await new Confirm({
        name: 'success',
        message: 'Init scraping for companies?'
      }).run()
      if (success) {
        logger.debug(
          `Running Scratcher container: ${iocContainer.cradle.scratcher}`
        )
        await iocContainer.cradle.scratcher.run()
        logger.debug(`Scratcher finished successfully`)
      } else {
        logger.debug(`skipped scratcher: keep on running Server...`)
      }
    }),
  err => {
    logger.error('Error while starting up server', err)
    process.exit(1)
  }
)
