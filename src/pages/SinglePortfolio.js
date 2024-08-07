import Header from '../components/Header';
import StockHoldingList from '../components/StockHolding/StockHoldingList';
import StockTransaction from './StockTransaction';
import '../components/Portfolio.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import List from '../components/StocksStockHolding/List';
import SingleStock from '../components/FullStockInfo/SingleStock';
import Statistics from '../components/Stats/Statistics';
import DepositPortfolio from './DepositPortfolio';

export default function SinglePortfolio() {
    const uid = localStorage.getItem('userid');
    const portfolioID = useParams().id;
    const [userInfo, setUserInfo] = useState([]);
    const [portfolioInfo, setPortfolioInfo] = useState([]);
    const [amount, setAmount] = useState(0);
    const [openStocks, setOpenStocks] = useState(false);
    const [openTransaction, setOpenTransaction] = useState(false);
    const [marketValue, setMarketValue] = useState(0);
    const [openAnalytics, setOpenAnalytics] = useState(false);
    const [mySymbol, setStockSymbol] = useState('');
    const [openStatistics, setOpenStatistics] = useState(false);
    const [openDeposit, setOpenDeposit] = useState(false);

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
    }, [openDeposit]);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/marketinfo/${portfolioID}/${uid}`);
                const jsonData = await response.json();
                let totalMarketValue = 0;
                jsonData.forEach((stock) => {
                    totalMarketValue += stock.close * stock.num_shares;
                });
                setMarketValue(totalMarketValue);
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

    if (openStocks) {
        return (
            <div>
                <Header profile={true}/>
                <List stocklist={setOpenStocks} listBool={false} holdingBool={true} id={portfolioID}/>
            </div>
        );
    }
    if (openTransaction) {
        return (
            <div>
                <Header profile={true}/>
                <StockTransaction openTransactions={setOpenTransaction}/>
            </div>
        );
    }
    if (openAnalytics) {
        return (
            <div>
                <SingleStock closeStockInfo={setOpenAnalytics} stockSymbol={mySymbol} />
            </div>
        );
    }
    if (openStatistics) {
        return (
            <div>
                <Header profile={true} />
                <Statistics setOpenStatistics={setOpenStatistics} isPortfolio={true}  id={portfolioID} uid = {uid}/>
            </div>
        );
    }
    if (openDeposit) {
        return (
            <div>
                <DepositPortfolio setOpenDeposit={setOpenDeposit}/>
            </div>
        );
    }
    return (
        <div>
            <Header profile={true} />
            <div className='portfolio' style={{ color: 'white', padding: 5 }}>
                <div className='full-p-info'>
                    <div className='portfolio-info'>
                        <h1>{userInfo.username}'s Portfolio #{portfolioInfo.portfolioid}</h1>
                        <button onClick={() => setOpenStatistics(true)}>View Portfolio Statistics</button>
                    </div>
                    <h2 className='account'><span style={{ color: 'black' }}>Cash Account</span>: ${portfolioInfo.cash_account}</h2>
                    <p className='account'><span style={{ color: 'black' }}>Estimated present market value</span>: {marketValue + portfolioInfo.cash_account}</p>
                </div>
                <div className='money-header'>
                    <h2 style={{ color: 'white' }}>Money Transactions</h2>
                    <p className='header-text'style={{ color: 'white' }}>: Deposit or withdraw money from your cash account</p>
                </div>
            </div>
            <div className='money-transactions'>
                <button className='money' onClick={() => setOpenDeposit(true)}>Deposit</button>
                <div className='money-transactions'>
                    <input className='money-input' type='number' placeholder='Amount' value={amount} onChange={handleInputChange}></input>
                    <button className='money-widthdraw' onClick={handleWithdraw}>Withdraw</button>
                </div>
            </div>
            <div>
                <h1 style={{ color: 'white', paddingTop: 20 }}>Stock Holdings</h1>
                <StockHoldingList cashAccount={portfolioInfo.cash_account} portfolioID={portfolioID} openA={setOpenAnalytics} symbol = {setStockSymbol}/>
            </div>
            <button className='trans-history' onClick={() => setOpenTransaction(true)}>View Stock Transaction List</button>
            <button className='add-stocks' onClick={() => setOpenStocks(true)}>Add Stocks to Holdings</button>
        </div>
    );
}