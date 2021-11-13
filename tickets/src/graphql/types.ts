import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export type Mutation = {
  __typename?: "Mutation";
  addTicket: Ticket;
  deleteTicket?: Maybe<Ticket>;
  updateTicket?: Maybe<Ticket>;
};

export type MutationAddTicketArgs = {
  data: TicketInput;
};

export type MutationDeleteTicketArgs = {
  ticketId: Scalars["ID"];
};

export type MutationUpdateTicketArgs = {
  data: TicketInput;
  ticketId: Scalars["ID"];
};

export type Query = {
  __typename?: "Query";
  getAllTickets: Array<Maybe<Ticket>>;
  getTicket?: Maybe<Ticket>;
};

export type QueryGetTicketArgs = {
  ticketId: Scalars["ID"];
};

export type Ticket = {
  __typename?: "Ticket";
  price: Scalars["Float"];
  ticketId: Scalars["ID"];
  title: Scalars["String"];
};

export type TicketInput = {
  price: Scalars["Float"];
  title: Scalars["String"];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
  reference: TReference,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
type NullableCheck<T, S> = Maybe<T> extends T
  ? Maybe<ListCheck<NonNullable<T>, S>>
  : ListCheck<T, S>;
type ListCheck<T, S> = T extends (infer U)[]
  ? NullableCheck<U, S>[]
  : GraphQLRecursivePick<T, S>;
export type GraphQLRecursivePick<T, S> = {
  [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]>;
};

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Query: ResolverTypeWrapper<{}>;
  Ticket: ResolverTypeWrapper<Ticket>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  TicketInput: TicketInput;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Mutation: {};
  ID: Scalars["ID"];
  Query: {};
  Ticket: Ticket;
  Float: Scalars["Float"];
  String: Scalars["String"];
  TicketInput: TicketInput;
  Boolean: Scalars["Boolean"];
}>;

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  addTicket?: Resolver<
    ResolversTypes["Ticket"],
    ParentType,
    ContextType,
    RequireFields<MutationAddTicketArgs, "data">
  >;
  deleteTicket?: Resolver<
    Maybe<ResolversTypes["Ticket"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTicketArgs, "ticketId">
  >;
  updateTicket?: Resolver<
    Maybe<ResolversTypes["Ticket"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTicketArgs, "data" | "ticketId">
  >;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  getAllTickets?: Resolver<
    Array<Maybe<ResolversTypes["Ticket"]>>,
    ParentType,
    ContextType
  >;
  getTicket?: Resolver<
    Maybe<ResolversTypes["Ticket"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetTicketArgs, "ticketId">
  >;
}>;

export type TicketResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes["Ticket"] = ResolversParentTypes["Ticket"]
> = ResolversObject<{
  __resolveReference?: ReferenceResolver<
    Maybe<ResolversTypes["Ticket"]>,
    { __typename: "Ticket" } & GraphQLRecursivePick<
      ParentType,
      { ticketId: true }
    >,
    ContextType
  >;
  price?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  ticketId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Ticket?: TicketResolvers<ContextType>;
}>;
