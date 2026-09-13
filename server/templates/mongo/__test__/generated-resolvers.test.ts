import blogSample from '../../../__fixtures__/schemas/blog.mongo.json';
import { generateResolver } from '../graphqlResolvers';

describe('Mongo generated resolvers', () => {
  it('wraps generated query and mutation operations with access middleware', () => {
    const postSchema = blogSample.schemas.find((schema) => schema.originalCollectionName === 'posts');
    expect(postSchema).toBeDefined();

    const resolverSource = generateResolver(
      blogSample.app.appName,
      postSchema!.originalCollectionName,
      postSchema!.singularCollectionName,
      postSchema!.pluralCollectionName,
      postSchema!.schema
    );

    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'betaBlog', 'posts')");
    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'betaBlog', 'post')");
    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'betaBlog', 'create_post')");
    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'betaBlog', 'update_post')");
    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'betaBlog', 'delete_post')");
    expect(resolverSource).toContain('checkPostAccess(parent, args, contextValue, info, postMiddlewareResult)');
  });

  it('emits Mongo CRUD calls for the sample schema', () => {
    const postSchema = blogSample.schemas.find((schema) => schema.originalCollectionName === 'posts')!;
    const resolverSource = generateResolver(
      blogSample.app.appName,
      postSchema.originalCollectionName,
      postSchema.singularCollectionName,
      postSchema.pluralCollectionName,
      postSchema.schema
    );

    expect(resolverSource).toContain('posts.find(filters, projection, options)');
    expect(resolverSource).toContain('posts.find(filters).count()');
    expect(resolverSource).toContain('posts.findOne(filters, projection, options)');
    expect(resolverSource).toContain('const model = new posts(preMiddlewareResult.args.input)');
    expect(resolverSource).toContain('posts.findOneAndUpdate(filters, updates, options)');
    expect(resolverSource).toContain('posts.findOneAndDelete(filters, options)');
  });
});
