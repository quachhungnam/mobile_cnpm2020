
import { your_ip } from './your_ip'
const api_transactions = `${your_ip}:3000/transactions`;


async function addTransaction(user, user_token, post_id) {
    try {
        let response = await fetch(api_transactions, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: user_token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: user._id,
                post_id: post_id,
            }),
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(`Error is: ${error}`);
    }
}

async function getTransactions() {
    try {
        let response = await fetch(api_transactions);
        let responseJson = await response.json();
        return responseJson.transaction;
    } catch (error) {
        console.error(`Error is: ${error}`);
    }
}

async function delTransaction(user_token, tranId) {
    try {
        let response = await fetch(`${api_transactions}/${tranId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: user_token,
                'Content-Type': 'application/json',
            },
        });
        let responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error(`Error is: ${error}`);
    }
}

export { addTransaction };
export { getTransactions };
export { delTransaction };
