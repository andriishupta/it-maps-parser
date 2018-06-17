import { createController } from 'awilix-koa'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = companyService => ({
  findCompanies: async ctx => ctx.ok(await companyService.find(ctx.query)),
  getCompany: async ctx => ctx.ok(await companyService.get(ctx.params.id)),
  createCompany: async ctx =>
    ctx.created(await companyService.create(ctx.request.body)),
  updateCompany: async ctx =>
    ctx.ok(await companyService.update(ctx.params.id, ctx.request.body)),
  removeCompany: async ctx =>
    ctx.noContent(await companyService.remove(ctx.params.id))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/companies')
  .get('', 'findCompanies')
  .get('/:id', 'getCompany')
  .post('', 'createCompany')
  .patch('/:id', 'updateCompany')
  .delete('/:id', 'removeCompany')
