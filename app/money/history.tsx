type Transaction = {
    key: number,
    id: number,
    name: string,
    money: number,
    date: string
}

type historyProps = {
    newHistory: Transaction[]
}

const TransactionList = ({ id, name, money, date }: Transaction) => {
    return (
        <div className="bg-gray-100 rounded-sm border-0.5 border-green-100 flex justify-between p-2 my-1">
            <div className="flex-row">
                <h2 className="text-green-950 text-start text-2xl">{name}</h2>
                <p>{date}</p>
            </div>
            <div className="justify-center items-center flex">
                <h2 className="text-2xl">Rp{money ? money.toLocaleString("id-ID") : '0'}</h2>
            </div>
        </div>
    )
}

// const BlockOfTransaction =({ newHistory }: historyProps) => {
//     return (
//         <div className="h-128 overflow-y-auto">
//             {newHistory.map(his => <TransactionList key={his.id} id={his.id} name={his.name} money={his.money} date={his.date} />)}
//         </div>
//     )
// }

const History = ({ newHistory }: historyProps)  => {
    return (
        <div className="my-10 flex-row max-w-120 mx-auto">
            <h2 className="font-bold text-2xl">History</h2>
             <div className="h-128 overflow-y-auto">
                {newHistory.map(his => <TransactionList key={his.id} id={his.id} name={his.name} money={his.money} date={his.date} />)}
            </div>
        </div>
    )
}

export default History