const graphql = require('graphql');
const axios = require('axios');

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLSchema
} = graphql;

const TicketType = new GraphQLObjectType({
	name: 'Ticket',
	fields: {
		id: {type: GraphQLInt},
		title: {type: GraphQLString},
		content: {type: GraphQLString},
		priority: {type: GraphQLString},
		status: {type: GraphQLString}
	}
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		ticket: {
			type: TicketType,
			args: {id: { type: GraphQLInt } },
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/tickets/${args.id}`)
					.then(res => res.data);
			}
		}
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery
});