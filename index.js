const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

let customerList = [
	{
		id: 1,
		name: 'Philippa Earl',
		phone: '(235) 976 6549'
	},
	{
		id: 2,
		name: 'Calvin Upward',
		phone: '(257) 977 4903'
	},
	{
		id: 3,
		name: 'Karry Vallintine',
		phone: '(546) 193 0328'
	},
	{
		id: 4,
		name: 'Samaria Siverns',
		phone: '(697) 751 1411'
	},
	{
		id: 5,
		name: 'Anne Brownhill',
		phone: '(797) 152 6500'
	}
];

const doesNameAlreadyExists = (nameParams) =>
	!!customerList.find(({ name }) => name === nameParams);

const doesRecordAlreadyExists = (selectedId) => !!customerList.find(({ id }) => id === selectedId);

const generateNewId = () => Math.max(...customerList.map(({ id }) => id)) + 1;

app.get('/info', (_, res) => {
	const personText = customerList.length === 1 ? 'person' : 'people';
	const responseText = `Phonebook has info for ${customerList.length} ${personText}`;
	const fullResponseText = customerList.length < 1 ? 'Phonebook has no info' : responseText;
	res.send(fullResponseText);
});

app.get('/api/persons', (_, res) => {
	res.json(customerList);
});

app.get('/api/persons/:id', ({ params: { id: selectedId } }, res) => {
	const selectedCustomer = customerList.find(({ id }) => id === Number(selectedId));
	selectedCustomer
		? res.json(selectedCustomer)
		: res.status(404).json({
				status: 404,
				message: 'There is no such record'
		  });
});

app.delete('/api/persons/:id', ({ params: { id: selectedId } }, res) => {
	const selectedCustomer = customerList.find(({ id }) => id === Number(selectedId));
	const newCustomerList = customerList.filter(({ id }) => id !== Number(selectedId));
	selectedCustomer
		? res.json({
				status: 200,
				message: 'Record has been deleted',
				phoneRecords: newCustomerList
		  })
		: res.status(404).json({
				status: 404,
				message: 'There is no such record to delete'
		  });
});

app.post('/api/persons', ({ body: { name, phone } }, res) => {
	if (name && phone) {
		if (doesNameAlreadyExists(name)) {
			return res.status(400).json({
				status: 400,
				message: 'Name must be unique'
			});
		}
		const newCustomerList = [...customerList, { id: generateNewId(), name, phone }];
		return res.json({
			status: 200,
			message: 'Records have been added',
			phoneRecords: newCustomerList
		});
	}
	return res.status(400).json({
		status: 400,
		message: 'Name or Phone missing'
	});
});

app.put('/api/persons/:id', ({ params: { id: selectedId }, body: { name, phone } }, res) => {
	if (name && phone) {
		if (!doesRecordAlreadyExists(Number(selectedId))) {
			return res.status(400).json({
				status: 400,
				message: 'There is no such record to update'
			});
		}
		if (doesNameAlreadyExists(name)) {
			return res.status(400).json({
				status: 400,
				message: 'Name must be unique'
			});
		}
		const selectedCustomer = customerList.find(({ id }) => id === Number(selectedId));
		const updatedCustomer = { ...selectedCustomer, name };
		const filteredCustomerList = customerList.filter(({ id }) => id !== Number(selectedId));
		const newCustomerList = [...filteredCustomerList, updatedCustomer];
		return res.json({
			status: 200,
			message: 'Record has been updated',
			phoneRecords: newCustomerList
		});
	}
	return res.status(400).json({
		status: 400,
		message: 'Name or Phone missing'
	});
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
