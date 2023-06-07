
import React, { useEffect, useState } from 'react';

function HouseDetails(props) {

  const [house, setHouse] = useState(null);
  const [updatedAddress, setUpdatedAddress] = useState('');
  const [updatedValue, setUpdatedValue] = useState('');
  const [updatedLoanAmount, setUpdatedLoanAmount] = useState('');

  const id = props.houseId;

  // Getting the home details when the component mounts
  useEffect(async () => {
    getDetails();
  }, []);

  // Getting the home details
  const getDetails = async (req, res) => {
    try {
      // request to the `GET /api/houses/:id`
      const response = await fetch(`http://localhost:3001/houses/${id}`);
      if (response.ok) {
        const data = await response.json();
        // setting the response data in the variables
        setHouse(data.result);
        setUpdatedValue(data.result.currentValue);
        setUpdatedLoanAmount(data.result.loanAmount);
        setUpdatedAddress(data.result.address);
      } else {
        throw new Error('Request failed');
      }
    } catch {
      console.log('failed in getDetails()');
    }
  }

  // function onSubmit the updating
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // The same calculation of the risk as in the creation of house
    let risk = parseFloat(updatedLoanAmount) / parseFloat(updatedValue);
    if (risk > 0.5) {
      risk += 0.1;
    }
    risk = (Math.min(Math.max(risk, 0), 1)).toFixed(3);

    try {
      // request to the `PUT /api/houses/:id`
      const response = await fetch(`http://localhost:3001/houses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: updatedAddress,
          currentValue: updatedValue,
          loanAmount: updatedLoanAmount,
          risk: risk,
        }),
      });

      if (response.ok) {
        alert('House details updated successfully.');
        // If accepted ok Sending to the function getDetails() to display the updated data
        await getDetails();
      } else {
        alert('Failed to update house details.');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // If no house is displayed Loading...
  if (!house) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleUpdateSubmit}>

        <div className="mb-3">
          <h2>House Details</h2>
          <p>Address: {house.address}</p>
          <p>Current Value: {house.currentValue}</p>
          <p>Loan Amount: {house.loanAmount}</p>
          <p>Risk: {house.risk}</p>
          <h3>Update House Details</h3>
          <label className="form-label" htmlFor="email">
            Update Address
          </label>
          <input className="form-control" onChange={(e) => setUpdatedAddress(e.target.value)} placeholder="Update Address" type="text" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Update Value
          </label>
          <input className="form-control" onChange={(e) => setUpdatedValue(e.target.value)} placeholder="Update Value" type="number" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Loan Amount
          </label>
          <input className="form-control" onChange={(e) => setUpdatedLoanAmount(e.target.value)} placeholder="Loan Amount" type="number" />
        </div>
        <button className="btn btn-danger" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default HouseDetails;