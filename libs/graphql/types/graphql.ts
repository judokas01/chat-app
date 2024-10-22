/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  lastMessageAt?: Maybe<Scalars['DateTime']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Array<ConversationUser>>;
};

export type ConversationMessageResponse = {
  __typename?: 'ConversationMessageResponse';
  cursor: Scalars['String']['output'];
  hasMore: Scalars['Boolean']['output'];
  messages: Array<Message>;
};

export type ConversationUser = {
  __typename?: 'ConversationUser';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
  renewToken: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  author: ConversationUser;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRemoved: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createConversation: Conversation;
  register: RegisterResponse;
  sendMessage: Message;
};


export type MutationCreateConversationArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  userIds: Array<Scalars['String']['input']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  conversationId: Scalars['String']['input'];
  text: Scalars['String']['input'];
};

export type Pagination = {
  cursor: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  findUsers: Array<ConversationUser>;
  getConversationMessages: ConversationMessageResponse;
  getUserConversations: Array<Conversation>;
  login: LoginResponse;
};


export type QueryFindUsersArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetConversationMessagesArgs = {
  conversationId: Scalars['String']['input'];
  pagination: Pagination;
};


export type QueryGetUserConversationsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryLoginArgs = {
  password: Scalars['String']['input'];
  userName: Scalars['String']['input'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  getConversationMessagesSub: Message;
};


export type SubscriptionGetConversationMessagesSubArgs = {
  conversationId: Scalars['String']['input'];
};
