
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import "./SingleStockList.css"



export default function SingleStockList(){
    const uid = localStorage.getItem('userid');
    const listId = useParams().id;
    const [isVisible, setIsVisible] = useState(false);
    const [stockListItems, setStockListItems] = useState([]);
    const [reviewsList, setReviewsList] = useState([]);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/stocklistitems/${uid}/${listId}`);
                const data = await res.json();
                setStockListItems(data);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/reviews/${uid}/${listId}`);
                const data = await res.json();
                setReviewsList(data);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    return (
        <div>
            <Header profile={true}></Header>
            <div className="stock-list">
                <h1 className='stock-list-title'>Stock List: {listId}</h1>
                <div className="toggleContainer">
                    {isVisible === false && (
                        <button className="share-button">Share</button>
                    )}
                    <h1>
                        {isVisible === true && (
                            <h1 className={`stock-list-title ${isVisible ? 'visible' : 'hidden'}`}>Public</h1>
                        )}
                        {isVisible === false && (
                            <h1 className={`stock-list-title ${isVisible ? 'visible' : 'hidden'}`}>Not Public</h1>
                        )}
                    </h1>
                    <div className={`toggle-container ${isVisible ? 'visible' : 'hidden'}`} onClick={toggleVisibility}>
                        <div className={`toggle-button ${isVisible ? 'visible' : 'hidden'}`}></div>
                    </div>
                </div>
            </div>
            <table className='stock-list-table'>
                <thead>
                    <tr>
                        <th scope="col">Stock Symbol</th>
                        <th scope="col">Amount Owned</th>
                    </tr>
                </thead>
                <tbody className='stock-list-item'>
                    {stockListItems.map((item) => (
                        <tr>
                            <td>{item.symbol}</td>
                            <td>{item.num_shares}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="add-button-container">
                <button className='add-button'>Add stocks to list</button>  
            </div>
            <div className='reviews'>
                <h2 className='review-title'>Reviews</h2>
                {reviewsList.map((review) => (
                    <div className='review-item'>
                        <h3>Username: {review.username}</h3>
                        <h4 className='review-text'>{review.review_text}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}