import commerceSample from '../../../__fixtures__/schemas/commerce.mysql.json';
import { generateResolver } from '../graphqlResolvers';

describe('MySQL generated resolvers', () => {
  it('wraps generated query and mutation operations with access middleware', () => {
    const orderSchema = commerceSample.schemas.find((schema) => schema.originalCollectionName === 'orders');
    expect(orderSchema).toBeDefined();

    const resolverSource = generateResolver(
      commerceSample.app.appName,
      orderSchema!.originalCollectionName,
      orderSchema!.singularCollectionName,
      orderSchema!.pluralCollectionName,
      orderSchema!.schema as any
    );

    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'betaCommerce', 'orders')");
    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'betaCommerce', 'order')");
    expect(resolverSource).toContain(
      "checkPreAccess(parent, args, contextValue, info, 'betaCommerce', 'create_order')"
    );
    expect(resolverSource).toContain(
      "checkPreAccess(parent, args, contextValue, info, 'betaCommerce', 'update_order')"
    );
    expect(resolverSource).toContain(
      "checkPreAccess(parent, args, contextValue, info, 'betaCommerce', 'delete_order')"
    );
    expect(resolverSource).toContain('checkPostAccess(parent, args, contextValue, info, postMiddlewareResult)');
  });

  it('emits Sequelize CRUD calls for the sample schema', () => {
    const orderSchema = commerceSample.schemas.find((schema) => schema.originalCollectionName === 'orders')!;
    const resolverSource = generateResolver(
      commerceSample.app.appName,
      orderSchema.originalCollectionName,
      orderSchema.singularCollectionName,
      orderSchema.pluralCollectionName,
      orderSchema.schema as any
    );

    expect(resolverSource).toContain('orders.findAll(query)');
    expect(resolverSource).toContain('orders.count({where: filters || {}})');
    expect(resolverSource).toContain('orders.findOne(query)');
    expect(resolverSource).toContain('orders.create(preMiddlewareResult.args.input)');
    expect(resolverSource).toContain('orders.update(updates');
    expect(resolverSource).toContain('orders.destroy({');
  });
});
