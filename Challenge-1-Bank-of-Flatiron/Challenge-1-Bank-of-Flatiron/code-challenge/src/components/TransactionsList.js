import React, { useState, useEffect } from "react";
import Transaction from "./Transaction";

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    category: '',
    amount: ''
  });

  useEffect(() => {
    fetch('http://localhost:8001/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:8001/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTransaction)
    })
      .then(response => response.json())
      .then(data => {
        setTransactions([...transactions, data]);
        setNewTransaction({
          date: '',
          description: '',
          category: '',
          amount: ''
        });
      });
  };

  return (
    <div>
      <h1>Transactions</h1>
      <input 
        type="text" 
        placeholder="Search transactions" 
        value={searchTerm} 
        onChange={handleSearch} 
      />
      <form onSubmit={handleSubmit}>
        <input 
          type="date" 
          name="date" 
          value={newTransaction.date} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="text" 
          name="description" 
          placeholder="Description" 
          value={newTransaction.description} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="text" 
          name="category" 
          placeholder="Category" 
          value={newTransaction.category} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="number" 
          name="amount" 
          placeholder="Amount" 
          value={newTransaction.amount} 
          onChange={handleInputChange} 
          required 
        />
        <button type="submit">Add Transaction</button>
      </form>
      <table className="ui celled striped padded table">
        <tbody>
          <tr>
            <th>
              <h3 className="ui center aligned header">Date</h3>
            </th>
            <th>
              <h3 className="ui center aligned header">Description</h3>
            </th>
            <th>
              <h3 className="ui center aligned header">Category</h3>
            </th>
            <th>
              <h3 className="ui center aligned header">Amount</h3>
            </th>
          </tr>
          {filteredTransactions.map(transaction => (
            <Transaction 
              key={transaction.id} 
              date={transaction.date}
              description={transaction.description}
              category={transaction.category}
              amount={transaction.amount}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsList;
