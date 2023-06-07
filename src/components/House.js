
import React, { useState } from 'react';
import HouseDetails from './HouseDetails';

const House = () => {

  const [address, setAddress] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [houseId, setHouseId] = useState('');

  // function onSubmit the form
  const onSubmit = async (e) => {
    e.preventDefault();

    // Calculation of the risk value according to the requirement
    let risk = parseFloat(loanAmount) / parseFloat(currentValue);
    // Addition of 10% If the `loanAmount` is more than 50% of the `currentValue`,
    if (risk > 0.5) {
      risk += 0.1;
    }
    // The value of the risk between 0 and 1 and display a number with only three digits after the decimal point
    risk = (Math.min(Math.max(risk, 0), 1)).toFixed(3);


    try {
      // request to the `POST /api/houses`
      const response = await fetch('http://localhost:3001/houses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          currentValue,
          loanAmount,
          risk,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHouseId(data.House._id);
        setShowDetail(true);
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <div>
      {/* Checking whether to display the component HouseDetails*/}
      {showDetail ? (
        <HouseDetails houseId={houseId} />
      ) : (
        <div className="container mt-5">
          <h2 className="mb-3">Hello to HouseTable</h2>
          <h2 className="mb-3"> Please enter an address and house value </h2>
          <form onSubmit={onSubmit}>

            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Address
              </label>
              <input className="form-control" onChange={(e) => setAddress(e.target.value)} placeholder="Address" type="text" id="address" value={address} required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Current Value
              </label>
              <input className="form-control" onChange={(e) => setCurrentValue(e.target.value)} placeholder="Current Value" type="number" id="name" value={currentValue} required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Loan Amount
              </label>
              <input className="form-control" onChange={(e) => setLoanAmount(e.target.value)} placeholder="Loan Amount" type="number" id="name" value={loanAmount} required />
            </div>
            <button className="btn btn-danger" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
export default House