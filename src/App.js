import React, { useState, useEffect } from "react";
import './App.css';

function NameForm(props) {
    const [checkInData, setCheckInData] = useState({ name: "" });
    const [checkOutData, setCheckOutData] = useState({ name: "" });

    function handleCheckInChange(e) {
        setCheckInData({ ...checkInData, [e.target.name]: e.target.value });
    }

    function handleCheckOutChange(e) {
        setCheckOutData({ ...checkOutData, [e.target.name]: e.target.value });
    }

    function handleCheckInSubmit(e) {
        e.preventDefault();
        const currentTime = new Date().toLocaleTimeString();
        props.onCheckIn({ ...checkInData, time: currentTime });
        setCheckInData({ name: "" });
    }

    function handleCheckOutSubmit(e) {
        e.preventDefault();
        const currentTime = new Date().toLocaleTimeString();

        if (!props.checkOutData.some(entry => entry.name === checkOutData.name)) {
            props.onCheckOut({ ...checkOutData, time: currentTime });
            setCheckOutData({ name: "" });
        } else {
            alert(`${checkOutData.name} has already checked out.`);
        }
    }

    return (
        <>
            <h1>Employee Attendance</h1>
            <div className="form-section">
                <form onSubmit={handleCheckInSubmit}>
                    <h2>Check In</h2>
                    <input type="text" name="name" placeholder="Name" value={checkInData.name} onChange={handleCheckInChange} required />
                    <button type="submit" disabled={!checkInData.name}>Check In</button>
                </form>
                <form onSubmit={handleCheckOutSubmit}>
                    <h2>Check Out</h2>
                    <input type="text" name="name" placeholder="Name" value={checkOutData.name} onChange={handleCheckOutChange} required />
                    <button type="submit" disabled={!checkOutData.name}>Check Out</button>
                </form>
            </div>
        </>
    );
}

function ListofPeople(props) {
    function findCheckInEntry(workerName) {
        return props.checkInData.find(entry => entry.name === workerName);
    }

    return (
        <div className="list-container">
            <div className="list-section">
                <h2>Check In/Out Data</h2>
                <ul>
                    {props.checkOutData.map((worker, index) => (
                        <li key={index}>
                            <span>{worker.name} checked out at {worker.time}</span>
                            {findCheckInEntry(worker.name) &&
                                <span> (Checked in at {findCheckInEntry(worker.name).time})</span>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function App() {
    const [checkInData, setCheckInData] = useState([]);
    const [checkOutData, setCheckOutData] = useState([]);

    useEffect(() => {
        // Load data from localStorage on component mount
        const storedCheckInData = JSON.parse(localStorage.getItem('checkInData') || '[]');
        const storedCheckOutData = JSON.parse(localStorage.getItem('checkOutData') || '[]');
        setCheckInData(storedCheckInData);
        setCheckOutData(storedCheckOutData);
    }, []);

    useEffect(() => {
        // Save data to localStorage whenever checkInData or checkOutData changes
        localStorage.setItem('checkInData', JSON.stringify(checkInData));
        localStorage.setItem('checkOutData', JSON.stringify(checkOutData));
    }, [checkInData, checkOutData]);

    function handleCheckIn(newCheckIn) {
        setCheckInData(prevCheckIns => [...prevCheckIns, newCheckIn]);
    }

    function handleCheckOut(newCheckOut) {
        setCheckOutData(prevCheckOuts => [...prevCheckOuts, newCheckOut]);
    }

    return (
        <div className="App">
            <NameForm onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} checkInData={checkInData} checkOutData={checkOutData} />
            <ListofPeople checkInData={checkInData} checkOutData={checkOutData} />
        </div>
    );
}

export default App;
