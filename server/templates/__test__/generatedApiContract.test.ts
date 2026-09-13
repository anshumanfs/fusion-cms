import { generateGraphqlSchema as generateMongoSchema } from '../mongo/graphqlSchemas';
import { generateResolver as generateMongoResolver } from '../mongo/graphqlResolvers';
import { generateGqlSchema as generateMysqlSchema } from '../mysql/graphqlSchemas';
import { generateResolver as generateMysqlResolver } from '../mysql/graphqlResolvers';
import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = {
  title: {
    type: 'String',
    required: true,
  },
  views: {
    type: 'Number',
  },
};

const appJson = {
  collections: [
    {
      originalCollectionName: 'posts',
      singularCollectionName: 'post',
      pluralCollectionName: 'posts',
    },
  ],
};

describe('generated API contract', () => {
  it('emits Mongo GraphQL CRUD schema and resolver operations', () => {
    const schemaSource = generateMongoSchema(schema as any, 'post', 'posts', appJson);
    const resolverSource = generateMongoResolver('blog', 'posts', 'post', 'posts', schema);

    expect(schemaSource).toContain('post(filters:JSONObject, options:findOneOptions): post');
    expect(schemaSource).toContain('posts(filters:JSONObject, options:findOptions): [post]');
    expect(schemaSource).toContain('count_posts(filters:JSONObject): Int');
    expect(schemaSource).toContain('create_post(input: postCreate!): post');
    expect(schemaSource).toContain(
      'update_post(filters: JSONObject!, updates: postUpdate!, options:updateOptions): post'
    );
    expect(schemaSource).toContain('delete_post(filters: JSONObject!, options:deleteOptions): post');

    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'blog', 'posts')");
    expect(resolverSource).toContain('posts.find(filters, projection, options)');
    expect(resolverSource).toContain('const model = new posts(preMiddlewareResult.args.input)');
    expect(resolverSource).toContain('posts.findOneAndUpdate(filters, updates, options)');
    expect(resolverSource).toContain('posts.findOneAndDelete(filters, options)');
  });

  it('emits MySQL GraphQL CRUD schema and resolver operations', () => {
    const schemaSource = generateMysqlSchema(schema, 'post', 'posts', appJson);
    const resolverSource = generateMysqlResolver('blog', 'posts', 'post', 'posts', schema as any);

    expect(schemaSource).toContain('posts(where:JSON, order:JSON, group:String, limit:Int, offset:Int): [post]');
    expect(schemaSource).toContain('post(where:JSON, order:JSON, group:String): post');
    expect(schemaSource).toContain('count_posts(where:JSON) : Int');
    expect(schemaSource).toContain('create_post(input:postCreate!): post');
    expect(schemaSource).toContain('update_post(where:JSON!, updates:postUpdate!): post');
    expect(schemaSource).toContain('delete_post(where:JSON!): post');

    expect(resolverSource).toContain("checkPreAccess(parent, args, contextValue, info, 'blog', 'posts')");
    expect(resolverSource).toContain('posts.findAll(query)');
    expect(resolverSource).toContain('posts.create(preMiddlewareResult.args.input)');
    expect(resolverSource).toContain('posts.update(updates');
    expect(resolverSource).toContain('posts.destroy({');
  });

  it('executes the generated CRUD-shaped GraphQL contract in memory', async () => {
    const typeDefs = `#graphql
      scalar JSON
      scalar JSONObject

      type Query {
        post(filters: JSONObject, options: JSON): post
        posts(filters: JSONObject, options: JSON): [post]
        count_posts(filters: JSONObject): Int
      }

      type Mutation {
        create_post(input: postCreate!): post
        update_post(filters: JSONObject!, updates: postUpdate!, options: JSON): post
        delete_post(filters: JSONObject!, options: JSON): post
      }

      type post {
        _id: ID
        title: String
        views: Int
      }

      input postCreate {
        title: String!
        views: Int
      }

      input postUpdate {
        title: String
        views: Int
      }
    `;
    const records = [{ _id: '1', title: 'Hello Beta', views: 1 }];
    const executableSchema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        JSON: {
          parseValue: (value: any) => value,
          serialize: (value: any) => value,
        },
        JSONObject: {
          parseValue: (value: any) => value,
          serialize: (value: any) => value,
        },
        Query: {
          post: () => records[0],
          posts: () => records,
          count_posts: () => records.length,
        },
        Mutation: {
          create_post: (_: any, args: any) => {
            const record = { _id: `${records.length + 1}`, ...args.input };
            records.push(record);
            return record;
          },
          update_post: (_: any, args: any) => {
            Object.assign(records[0], args.updates);
            return records[0];
          },
          delete_post: () => records.shift(),
        },
      },
    });

    await expect(
      graphql({
        schema: executableSchema,
        source: '{ posts { _id title views } count_posts }',
      })
    ).resolves.toMatchObject({
      data: {
        posts: [{ _id: '1', title: 'Hello Beta', views: 1 }],
        count_posts: 1,
      },
    });

    await expect(
      graphql({
        schema: executableSchema,
        source: 'mutation { create_post(input: { title: "Second", views: 2 }) { _id title views } }',
      })
    ).resolves.toMatchObject({
      data: {
        create_post: { _id: '2', title: 'Second', views: 2 },
      },
    });

    await expect(
      graphql({
        schema: executableSchema,
        source: 'mutation { update_post(filters: { _id: "1" }, updates: { views: 3 }) { _id title views } }',
      })
    ).resolves.toMatchObject({
      data: {
        update_post: { _id: '1', title: 'Hello Beta', views: 3 },
      },
    });

    await expect(
      graphql({
        schema: executableSchema,
        source: 'mutation { delete_post(filters: { _id: "1" }) { _id title views } }',
      })
    ).resolves.toMatchObject({
      data: {
        delete_post: { _id: '1', title: 'Hello Beta', views: 3 },
      },
    });
  });
});
