const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /customers
// @access  Private
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ assignedTo: req.user.id });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single customer
// @route   GET /customers/:id
// @access  Private
exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, assignedTo: req.user.id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new customer
// @route   POST /customers
// @access  Private
exports.createCustomer = async (req, res) => {
    try {
        req.body.assignedTo = req.user.id;
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update customer
// @route   PUT /customers/:id
// @access  Private
exports.updateCustomer = async (req, res) => {
    try {
        let customer = await Customer.findOne({ _id: req.params.id, assignedTo: req.user.id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete customer
// @route   DELETE /customers/:id
// @access  Private
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, assignedTo: req.user.id });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.deleteOne();
        res.status(200).json({ message: 'Customer removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Import bulk customers
// @route   POST /customers/bulk
// @access  Private
exports.importCustomers = async (req, res) => {
    try {
        const customersData = req.body;

        if (!Array.isArray(customersData)) {
            return res.status(400).json({ message: 'Input data must be an array' });
        }

        const customers = customersData.map(cust => ({
            ...cust,
            assignedTo: req.user.id
        }));

        const result = await Customer.insertMany(customers);
        res.status(201).json({ message: 'Customers imported successfully', count: result.length });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
