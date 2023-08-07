const serverJSGenerator = (port: number | string, appName: string) => {
  const appJSString = `  
      const app = require('express')(); 
      const { ApolloServer } = require('@apollo/server'); 
      const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer'); 
      const { expressMiddleware } = require('@apollo/server/express4'); 
      const resolver = require('./indexResolver'); 
      const schema = require('./indexSchema'); 
      const port = ${port}; 
      const cors = require('cors'); 
      const { json } = require('body-parser'); 
      const http = require('http'); 
      const work_env = ('NODE_ENV' in process.env) ? process.env.NODE_ENV.trim() : 'development'; 
      const dev = work_env.trim() === 'development'; 
      app.use(cors({ origin: '*' })); 
      const server = http.createServer(app); 
      const startApolloServer = async(dev) =>{ 
          const apollo = new ApolloServer({ 
              introspection: dev, 
              resolvers: resolver, 
              typeDefs: schema, 
              plugins: [ApolloServerPluginDrainHttpServer({ httpServer: server })] 
          }); 
          await apollo.start(); 
          console.log('✓ API is running on: http://localhost:${port}');
          app.use('/graphql/${appName}', cors(), json(), expressMiddleware(apollo));
          console.log('✔ ${appName} :- GraphQL running on http://localhost:${port}/graphql/${appName}'); 
          server.listen(port); 
      } 
      startApolloServer(dev);`;

  return appJSString;
};
export { serverJSGenerator };
