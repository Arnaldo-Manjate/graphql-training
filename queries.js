const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} = require("graphql");
var { books, authors } = require("./mockdata/mockdata");

/*-------------------------------------------
              Root Query Type
---------------------------------------------*/
const RootQuery = new GraphQLObjectType({
  name: "root_query",
  description: "Root query for api",
  fields: () => ({
    hello: {
      type: GraphQLString,
      description: "say hello",
      resolve: () => "Hello World",
    },
    getAllBooks: {
      type: new GraphQLList(BookType),
      description: "returns all books",
      resolve: () => books,
    },
    getAllAuthors: {
      type: new GraphQLList(AuthorType),
      description: "returns all authors",
      resolve: () => authors,
    },
    getOneBook: {
      type: BookType,
      description: "one Book",
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
  }),
});

/*-------------------------------------------
            Root Mutation Type
---------------------------------------------*/
const RootMutation = new GraphQLObjectType({
  name: "root_mutation_type",
  description: "root mutation type for the api",
  fields: () => ({
    deleteBook: {
      type: BookType,
      description: "delete a book",
      args: { id: { type: GraphQLInt } },
      resolve: (parent, args) => {
        const book = books.find(book => book.id === args.id)
        books = books.filter((book) => book.id !== args.id);

        return book
      },
    },
    postBook: {
      type: BookType,
      description: "post a book",
      args: {
        title: { type: GraphQLString },
        age: { type: GraphQLInt },
        authorId: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        var book = {
          id: books.length + 1,
          title: args.title,
          age: args.age,
          authorId: args.authorId,
        };
        books.push(book);

        return book
      },
    },
  }),
});

/*-------------------------------------------
              DATA TYPES
---------------------------------------------*/
const BookType = new GraphQLObjectType({
  name: "Book",
  description: "data structure for one book",
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: "book identifier",
    },
    title: {
      type: GraphQLString,
      description: "book title",
    },
    rating: {
      type: GraphQLInt,
      description: "book rating",
    },
    authorId: {
      type: GraphQLInt,
      description: "foreighn key of the books author",
    },
    author: {
      type: AuthorType,
      description: "the author of this particular book",
      resolve: (book) => authors.find((author) => author.id === book.authorId),
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Author of a book",
  fields: () => ({
    id: {
      type: GraphQLInt,
      description: "primary key used to identify an author",
    },
    name: {
      type: GraphQLString,
      description: "name of the author",
    },
    age: {
      type: GraphQLInt,
      description: "age of the author",
    },
    books: {
      type: new GraphQLList(BookType),
      description: "a list of all books that belong to the author",
      resolve: (author) => books.filter((book) => book.authorId === author.id),
    },
  }),
});

/*-------------------------------------------
              SCHEMA
---------------------------------------------*/
const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = {
  schema
};
