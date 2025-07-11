import React, { useEffect, useState } from "react";
import History from "./history";
import InputMoney from "./inputMoney";
import Transaction from "./transaction";
import moneyService from "../services/money";
import historyService from "../services/history";

function Money() {
    const [money, setMoney] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [showTransaction, setShowTransaction] = useState(false)
    const [history, setHistory] = useState([])
    
    useEffect(() => {
        moneyService.getMoney().then(response => {
            console.log(response.data.money)
            setMoney(response.data.money)
        })

        historyService.getHistory().then(res => {
            console.log(res.data.history)
            setHistory(res.data.history)
            console.log(history)
        })
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const handleClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const num = Number(inputValue);
        if (isNaN(num)) {
            window.alert('Number contains a string!');
        } else if (num === 0) {
            window.alert('Number is 0');
        } else {
            moneyService.postMoney(money + num).then(response => {
                setMoney(response.data.money)
            }) 

            historyService.postTransaction("hafizh", num).then(res => {
                setHistory(res.data.history)
            })
        }
        setInputValue("");
    }

    return (
        <div className="justify-center flex-row mt-1">
            <div className="text-center text-6xl gap-96">
                <h3 className="text-4xl">Money owed by</h3>
                <h1>Rp{money.toLocaleString("id-ID")}</h1>
            </div>

            <div className="flex justify-center">
                <button className="bg-green-200 p-2 rounded-md btn text-green-800 border-green-800" onClick={() => setShowTransaction(true)}>Add a transaction</button>
            </div>

            {showTransaction && (
                <div className="fixed inset-0 bg-opacity-40 bg-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                    <button
                        className="absolute top-2 right-2 text-xl"
                        onClick={() => setShowTransaction(false)}
                    >
                        &times;
                    </button>
                    <Transaction
                        handleClick={handleClick}
                        inputValue={inputValue}
                        handleChange={handleChange}
                    />
                    </div>
                </div>
                )}

            <History newHistory={history} />
        </div>
    )
}

export default Money