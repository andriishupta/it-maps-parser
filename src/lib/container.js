import { createContainer, Lifetime, ResolutionMode } from 'awilix'
import { logger } from './logger'

/**
 * Using Awilix, the following files and folders (glob patterns)
 * will be loaded.
 */
const modulesToLoad = [
  ['lib/scratcher.js', Lifetime.TRANSIENT],

  ['services/company-service.js', Lifetime.SCOPED],
  ['services/geocoding-service.js', Lifetime.SINGLETON],
  ['services/parser-service.js', Lifetime.SINGLETON],
  ['services/company-repository.js', Lifetime.SINGLETON],

  ['stores/*.js', Lifetime.SINGLETON]
]

/**
 * Configures a new container.
 *
 * @return {Object} The container.
 */
export function configureContainer() {
  const opts = {
    // Classic means Awilix will look at function parameter
    // names rather than passing a Proxy.
    resolutionMode: ResolutionMode.CLASSIC
  }
  return createContainer(opts)
    .loadModules(modulesToLoad, {
      // `modulesToLoad` paths should be relative
      // to this file's parent directory.
      cwd: `${__dirname}/..`,
      // Example: registers `services/todo-service.js` as `todoService`
      formatName: 'camelCase'
    })
    .registerValue({
      // Our logger is already constructed,
      // so provide it as-is to anyone who wants it.
      logger
    })
}
