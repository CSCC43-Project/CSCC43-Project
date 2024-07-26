import "./FriendList.css";
import Friend from "./Friend";
import { useState, useEffect } from "react";

function FriendList() {
    const [friend, setFriend] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    const [incoming, setIncoming] = useState(false);
    const [incomingList, setIncomingList] = useState([]);
    const [outgoing, setOutgoing] = useState(false);
    const [outgoingList, setOutgoingList] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:5000/friendslist/1');
                const jsonData = await response.json();
                setFriendsList(jsonData);
            } catch (err) {
                console.log('Error occured when fetching books');
            }
        })
        ();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:5000/friendslist/incoming/1');
                const jsonData = await response.json();
                setIncomingList(jsonData);
            } catch (err) {
                console.log('Error occured when fetching books');
            }
        })
        ();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:5000/friendslist/outgoing/1');
                const jsonData = await response.json();
                setOutgoingList(jsonData);
            } catch (err) {
                console.log('Error occured when fetching books');
            }
        })
        ();
    }, []);

    return (
        <div className="profile">
            <div className="friendslist">
                <div className="friendslist-header">
                    <button className="friendbutton" onClick={() => { setFriend(true); setIncoming(false); setOutgoing(false); }}>Friends</button>
                    <button className="friendbutton" onClick={() => { setFriend(false); setIncoming(true); setOutgoing(false); }}>Incoming</button>
                    <button className="friendbutton" onClick={() => { setFriend(false); setIncoming(false); setOutgoing(true); }}>Outgoing</button>
                </div>
                <div className="friends">
                    {friend && 
                    <div>
                        {friendsList.map((friend) => {
                            return (
                                <Friend key={friend.friendid} id={friend.friendid} />
                            );
                        })}
                    </div>}
                    {incoming &&
                    <div>
                        {incomingList.map((friend) => {
                            return (
                                <Friend key={friend.senderid} id={friend.senderid} />
                            );
                        })}
                    </div>}
                    {outgoing && 
                    <div>
                        {outgoingList.map((friend) => {
                            return (
                                <Friend key={friend.receiverid} id={friend.receiverid} />
                            );
                        })}
                    </div>}
                </div>
            </div>
        </div>
    );
}
export default FriendList;