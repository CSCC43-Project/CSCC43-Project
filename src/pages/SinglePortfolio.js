import Header from '../components/Header';
import StockHoldingList from '../components/StockHolding/StockHoldingList';
import '../components/Portfolio.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function SinglePortfolio() {
    const uid = localStorage.getItem('userid');
    const portfolioID = useParams().id;
    const [userInfo, setUserInfo] = useState([]);
    const [portfolioInfo, setPortfolioInfo] = useState([]);
    const [marketValue, setMarketValue] = useState(10);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/${uid}`);
                const jsonData = await response.json();
                setUserInfo(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/portfolios/${portfolioID}/${uid}`);
                const jsonData = await response.json();
                setPortfolioInfo(jsonData[0]);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);

    async function updateCash(amt) {
        try {
            const response = await fetch(`http://localhost:5000/portfolios/${portfolioID}/${uid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cash_account: amt })
            });
            const jsonData = await response.json();
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
    }
    const handleInputChange = (e) => {
        setAmount(e.target.value);
    }
    const handleDeposit = () => {
        updateCash(Number(portfolioInfo.cash_account) + Number(amount));
    }
    const handleWithdraw = () => {
        updateCash(portfolioInfo.cash_account - amount);
    }

    return (
        <div>
            <Header profile={true} />
            <div className='portfolio' style={{ color: 'white', padding: 5 }}>
                <div className='full-p-info'>
                    <div className='portfolio-info'>
                            <h1>{userInfo.username}'s Portfolio #{portfolioInfo.portfolioid}</h1>
                            <button>View Portfolio Statistics</button>
                    </div>
                    <h2 className='account'><span style={{ color: 'black' }}>Cash Account</span>: ${portfolioInfo.cash_account}</h2>
                    <p className='account'><span style={{ color: 'black' }}>Estimated present market value</span>: {marketValue}%</p>
                </div>
                <h2 style={{ color: 'white' }}>Money Transactions</h2>
            </div>
            <div className='money-transactions'>
                <div>
                    <p style={{ color: 'white' }}>Deposit or withdraw money from your cash account</p>
                </div>
                <input className='money-input' type='number' placeholder='Amount' value={amount} onChange={handleInputChange}></input>
                <button className='money' onClick={handleDeposit}>Deposit</button>
                <button className='money' onClick={handleWithdraw}>Withdraw</button>
            </div>
            <div>
                <h1 style={{ color: 'white', paddingTop: 20 }}>Stock Holdings</h1>
                <StockHoldingList cashAccount={portfolioInfo.cash_account} portfolioID={portfolioID} />
            </div>
            <button className='trans-history'>View Stock Transaction List</button>
            <button className='add-stocks'>Add Stocks to Holdings</button>
        </div>
    );
}