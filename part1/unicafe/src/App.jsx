import { useState } from 'react'


function Button({type, onClick}) {
  console.log(`Clicked "${type}" Button`)
  return (
    <button onClick={onClick}>{type}</button>
  )
}

function Statistics({good, neutral, bad}) {

  if (good + neutral + bad === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <div>No feedback given</div>
      </div>
    )
  }
  
  return (
    <div>
      <h2>Statistics</h2>
      <div>good {good}</div>
      <div>neutral {neutral}</div>
      <div>bad {bad}</div>
      <div>average {(good - bad) / (good + neutral + bad)}</div>
      <div>positive {good / (good + neutral + bad)} %</div>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state

  console.log('Initialized App');
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>Give feedback</h2>
      <Button type="good" onClick={() => {setGood(good+1)}}></Button>
      <Button type="neutral" onClick={() => {setNeutral(neutral+1)}}></Button>
      <Button type="bad" onClick={() => {setBad(bad+1)}}></Button>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

export default App