import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function AnotherStockList(){
    const uid = localStorage.getItem('userid');
    const listId = useParams().listid;
    const ownerid = useParams().ownerid;

    const [stockListItems, setStockListItems] = useState([]);
    const [ownerUsername, setOwnerUsername] = useState('');
    const [reviewsList, setReviewsList] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ');
    
    const ref = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    useEffect(() => {
        if(ref.current){
            setMaxHeight(ref.current.offsetHeight);
        }
    }, []);

    const inputChange = (value) => {
       setEditText(value); 
    }

    function handleEdit(review){
        setIsEditing(true);
        setEditText(review.review_text);
        if(ref.current){
            setMaxHeight(ref.current.offsetHeight);
        }
    }
    
    function handleSave(){
        setIsEditing(false);
    }

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/stocklistitems/${ownerid}/${listId}`);
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
                const res = await fetch(`http://localhost:5000/username/${ownerid}`);
                const data = await res.json();
                setOwnerUsername(data.username);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/reviews/${ownerid}/${listId}`);
                const data = await res.json();
                setReviewsList(data);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    const deleteReview = (ownerid) => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/reviews/${ownerid}/${listId}/${uid}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                setReviewsList(reviewsList.filter((review) => review.reviewid !== ownerid));
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    const addReview = (ownerid, text) => {
        (async () => {
            try {
                const addReview = await fetch('http://localhost:5000/addReview', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({reviewerid: uid, stocklistid: listId, ownerid: ownerid, review_text: text}),
                });
                setIsEditing(false);
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    const updateReview = (ownerid, text) => {
        (async () => {
            try {
                const updateReview = await fetch('http://localhost:5000/updateReview', {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({reviewerid: uid, stocklistid: listId, ownerid: ownerid, review_text: text}),
                });
                const data = await updateReview.json();
                setIsEditing(false);
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    return (
        <div>
            <Header profile={true}/>
            <h1 className='stock-list-title'> {ownerUsername}'s stock list: {listId}</h1>
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

            <div className='empty-text-container'>
                { stockListItems == 0 && (
                    <h1 className='empty-text'>There are no stocks in this list.</h1>
                )}
            </div>

            <div className='reviews'>
                <h2 className='review-title'>Reviews</h2>
                <div className='empty-text-container'>
                    { reviewsList == 0 && (
                        <h1 className='empty-text'>There are no reviews for this list.</h1>
                    )}
                </div>
                {reviewsList.map((review) => (
                    <div className='review-item'>
                        <div className='review-bar'>
                            <div className='reviewer-info'>
                                <img className='profile-pic' src={review.profilepic_url}></img>
                                <h3 className='reviewer-name'>{review.username}</h3>
                            </div>
                            <div>
                                {review.reviewerid == uid && (
                                    <div>
                                        { isEditing ? (
                                            <button className='edit-review' onClick={() => updateReview(review.ownerid, editText)}>Save</button>
                                        ) : (
                                            <button className='edit-review' onClick={() => handleEdit(review)}>Edit</button>
                                        )}
                                        <button className='delete-review' onClick={() => deleteReview(review.ownerid)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        { isEditing && review.reviewerid == uid ? (
                            <textarea style={{height: maxHeight}} className='review-input' type='text' value={editText} onChange={(e) => inputChange(e.target.value)}/>
                        ) : (
                            <h4 ref={ref} className='review-text'>{review.review_text}</h4>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}