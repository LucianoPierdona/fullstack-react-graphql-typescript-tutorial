import { cacheExchange } from "@urql/exchange-graphcache";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from 'wonka';
import { MeDocument } from '../generated/graphql';
import { betterUpdateQuery } from "./betterUpdateQuery";


const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({error}) => {
      if (error) {
        if(error?.message.includes("not authenticated")) {
            Router.replace("/login");
        }
      }
    })
  )
}

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
  errorExchange,
  ssrExchange,
  fetchExchange
  ]
});