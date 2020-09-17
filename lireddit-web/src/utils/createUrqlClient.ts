import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql";
import { MeDocument } from '../generated/graphql';
import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        logout: (_result, args, cache, info) => {
          betterUpdateQuery<LogoutMutation, MeQuery>(
            cache,
            {query: MeDocument},
            _result,
            () => ({ me: null})
          );
        },
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(
              cache, 
              {query: MeDocument}, 
              _result, 
              (result, query) => {
                if (result.login.error) {
                  return query
                } else {
                  return {
                    me: result.login.user,
                  }
                }
              }
          );
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(
              cache, 
              {query: MeDocument}, 
              _result, 
              (result, query) => {
                if (result.register.error) {
                  return query
                } else {
                  return {
                    me: result.register.user,
                  }
                }
              }
          );
        }
      }
    }
  }),
  ssrExchange,
  fetchExchange
  ]
});