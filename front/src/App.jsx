
import './App.css'

function App() {

  return (
    <>
      <h1>Movie Recommender</h1>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <textarea type="text" />
        <button type='submit'>Submit</button>
      </div>

      <div className='movie-list' style={{ margin: '15px' }}>
        <div className="movie-card" style={{ backgroundColor: 'red', border: '1px solid lightgrey', margin: '10px', width: '100%', height: '100px' }}>

        </div>
      </div>
    </>
  )
}

export default App
