import blogSample from '../blog.mongo.json';
import sqlBlogSample from '../blog.mysql.json';
import commerceSample from '../commerce.mysql.json';
import accessControlSample from '../access-control.json';
import { generateGraphqlSchema as generateMongoGraphqlSchema } from '../../../templates/mongo/graphqlSchemas';
import { generateModelFileContent as generateMongoModel } from '../../../templates/mongo/dbModels';
import { generateGqlSchema as generateMysqlGraphqlSchema } from '../../../templates/mysql/graphqlSchemas';
import { generateMySqlSchema as generateMysqlModel } from '../../../templates/mysql/dbModels';

type SampleSchema = {
  appName: string;
  originalCollectionName: string;
  singularCollectionName: string;
  pluralCollectionName: string;
  schema: Record<string, any>;
};

const makeAppJson = (schemas: SampleSchema[]) => ({
  collections: schemas.map(({ originalCollectionName, singularCollectionName, pluralCollectionName, schema }) => ({
    originalCollectionName,
    singularCollectionName,
    pluralCollectionName,
    schema,
  })),
});

describe('beta sample schemas', () => {
  it('generate Mongo blog GraphQL and model sources', () => {
    const appJson = makeAppJson(blogSample.schemas);

    for (const schema of blogSample.schemas) {
      const graphqlSource = generateMongoGraphqlSchema(
        schema.schema as any,
        schema.singularCollectionName,
        schema.pluralCollectionName,
        appJson
      );
      const modelSource = generateMongoModel(
        schema.originalCollectionName,
        schema.pluralCollectionName,
        schema.schema as any
      );

      expect(graphqlSource).toContain(`${schema.pluralCollectionName}(filters:JSONObject`);
      expect(graphqlSource).toContain(`create_${schema.singularCollectionName}`);
      expect(modelSource).toContain(`conn.model('${schema.originalCollectionName}'`);
    }
  });

  it.each([
    ['MySQL blog', sqlBlogSample.schemas],
    ['MySQL commerce', commerceSample.schemas],
  ])('generates %s GraphQL and model sources', (_name, schemas) => {
    const appJson = makeAppJson(schemas);

    for (const schema of schemas) {
      const graphqlSource = generateMysqlGraphqlSchema(
        schema.schema as any,
        schema.singularCollectionName,
        schema.pluralCollectionName,
        appJson
      );
      const modelSource = generateMysqlModel(
        schema.originalCollectionName,
        schema.pluralCollectionName,
        schema.schema as any,
        appJson
      );

      expect(graphqlSource).toContain(`${schema.pluralCollectionName}(where:JSON`);
      expect(graphqlSource).toContain(`create_${schema.singularCollectionName}`);
      expect(modelSource).toContain(`tableName : '${schema.originalCollectionName}'`);
    }
  });

  it('includes access-control records with the resolver input shape', () => {
    for (const record of accessControlSample.records) {
      expect(record).toEqual(
        expect.objectContaining({
          email: expect.stringContaining('@'),
          appName: expect.any(String),
          endPointName: expect.any(String),
          isAllowed: expect.stringMatching(/^(true|false)$/),
          allowedInChain: expect.any(Boolean),
        })
      );
    }
  });
});
