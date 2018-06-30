const graphql = require('graphql');
const axios = require('axios');

const {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: {type: GraphQLInt},
		name: {type: GraphQLString},
		requestedTickets: {
			type: new GraphQLList(TicketType),
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/requesters/${parentValue.id}/tickets`)
					.then(res => res.data);
			}
		},
		assignedTickets: {
			type: new GraphQLList(TicketType),
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/assignees/${parentValue.id}/tickets`)
					.then(res => res.data);
			}
		}
	})
});

const TicketType = new GraphQLObjectType({
	name: 'Ticket',
	fields: () => ({
		id: {type: GraphQLInt},
		title: {type: GraphQLString},
		content: {type: GraphQLString},
		priority: {type: GraphQLString},
		status: {type: GraphQLString},
		requester: {
			type: UserType,
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/requesters/${parentValue.requesterId}`)
					.then(res => res.data);
			}
		},
		assignee: {
			type: UserType,
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/assignees/${parentValue.assigneeId}`)
					.then(res => res.data);
			}
		},
	})
});

const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addTicket: {
			type: TicketType,
			args: {
				id: { type: GraphQLInt },
				title: { type: new GraphQLNonNull(GraphQLString) },
				content: { type: GraphQLString },
				priority: { type: GraphQLString },
				status: { type: GraphQLString },
				requesterId: { type: new GraphQLNonNull(GraphQLInt) },
				assigneeId: { type: GraphQLInt }
			},
			resolve(parentValue, args){
				return axios.post(`http://localhost:3000/tickets`, args)
					.then(res => res.data);
			}
		},
		deleteTicket: {
			type: TicketType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt) }
			},
			resolve(parentValue, { id }){
				return axios.delete(`http://localhost:3000/tickets/${id}`)
					.then(res => res.data);
			}
		},
		editTicket: {
			type: TicketType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt) },
				title: { type: GraphQLString },
				content: { type: GraphQLString },
				priority: { type: GraphQLString },
				status: { type: GraphQLString },
				requesterId: { type: GraphQLInt },
				assigneeId: { type: GraphQLInt }
			},
			resolve(parentValue, args){
				return axios.patch(`http://localhost:3000/tickets/${args.id}`, args)
					.then(res => res.data);
			}
		}
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
		},
		requester: {
			type: UserType,
			args: {id: { type: GraphQLInt } },
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/requesters/${args.id}`)
					.then(res => res.data);
			}
		},
		assignee: {
			type: UserType,
			args: {id: { type: GraphQLInt } },
			resolve(parentValue, args){
				return axios.get(`http://localhost:3000/assignees/${args.id}`)
					.then(res => res.data);
			}
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: mutation
});