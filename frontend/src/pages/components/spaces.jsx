// import './spaces.css';

const Spaces = () =>{

  function onClickBack(){
    window.history.back();
  }
  return (
  <>
    <div className="spaces-page">
      <div className='spaces-page__header'>
        <h1>Your Spaces</h1>
        <button onClick={onClickBack}>back</button>
      </div>
    </div>
  </>);
}
export default Spaces;