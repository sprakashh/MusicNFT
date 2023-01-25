import React, { useState, useEffect } from 'react'
import web3 from './web3'
import NFTaudioclip from './NFThelper.js'
import './App.css'
import { useRef } from 'react'
import play from './play-icon.svg';
import pause from './pause.svg';
import loader from './loader.svg';
import logo from './music.png';
import 'bulma/css/bulma.css';

function App() {
  const [owner, setOwner] = useState('')
  const [accounts, setAccounts] = useState([])
  const [symbol, setSymbol] = useState('')
  const [name, setName] = useState('')
  const [totalTokens, setTotalTokens] = useState('')
  const [tokenUris, setTokenUris] = useState([])
  const [metaDataList, setMetaDataList] = useState([])
  const [isPlay, setIsPlay] = useState({});
  const [inputValue, setInputValue] = useState('')
  const [profit,setProfit]=useState([])
  const audioRef = useRef(null)
  
  function handleInputChange(event) {
    setInputValue(event.target.value)
  }

  function handlePlay() {
    // Play the audio
    audioRef.current.play()
  }
  function stopPlay(index) {
    // Play the audio
    audioRef.current.pause();
    const updatedPlayList = { ...isPlay };
    delete updatedPlayList[index];

    setIsPlay(updatedPlayList);
  }
  async function getAllDetails() {
    var acc = await web3.eth.getAccounts()
    var own = await NFTaudioclip.methods.owner().call()
    var sym = await NFTaudioclip.methods.symbol().call()
    var nam = await NFTaudioclip.methods.name().call()
    var totalToken = await NFTaudioclip.methods.getTotaltokens().call()
    var uris = await NFTaudioclip.methods.getURICollection().call()
    var meta = []
    
   
    var profits = []
    for (var i = 0; i < uris.length; i++) {
      await fetch(uris[i])
        .then((res) => res.json())
        .then((ress) => meta.push(ress))

        
        var prf= await NFTaudioclip.methods.getProfit(i).call();
        var profit = web3.utils.fromWei(prf,'ether')
        profits.push(profit)
        
    }
    setProfit(profits)
    
    setMetaDataList(meta)
    setTokenUris(uris)
    setTotalTokens(totalToken)
    setAccounts(acc)
    setOwner(own)
    setSymbol(sym)
    setName(nam)
  }
  
  async function mint(tokenUri) {

    var acc = await web3.eth.getAccounts()
    await NFTaudioclip.methods
      .MintNFT(acc[0], tokenUri)
      .send({ from: acc[0] })

  }
  async function getProfit(index) {
    
    return await NFTaudioclip.methods.getProfit(index);
  }
  const listenMusic = async (url, index) => {
  
    
    let updatedPlayItems = { ...isPlay, [index]: "loading" };
    setIsPlay(updatedPlayItems);

    audioRef.current.src = url
 
    audioRef.current.play();
    setTimeout(async()=>{
      audioRef.current.pause();
    await NFTaudioclip.methods
      .Playmusic(index)

      .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether'), gas: '1000000' })

    updatedPlayItems = { ...isPlay, [index]: "playing" };
    setIsPlay(updatedPlayItems);
    audioRef.current.play();
  
    },4000);

}




  useEffect(() => {
    getAllDetails()
  }, [profit])
  return (
    
    <div style={{ textAlign: 'center', marginTop: '100 px' }}>

      <div className='header'>
        <div className='logo-section'>
          <img src={logo} className="logo" />
          <h2>NFTaudio APP</h2>
        </div>
        <div className='search-wrapper'>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="search-input"
          placeholder='Enter audio source'
        />
        
        <button
          onClick={() => mint(inputValue)}
          className="search-btn"
        >
          Mint
        </button>
      </div>
      </div>
      <div class="tile">
        <article class="tile is-child notification is-primary">
          <p class="title">An NFT Music Track Application made using the ERC 721 Token Standard</p>
          <p class="subtitle">Keep Scrolling for our Music Collection!</p>
        </article>
      
      </div>
      
      <div className='FileInfo'>
     
      </div>
      <div className="tile"  style={{justifyContent:'center' }}>
     '
        <div
          className="tile is-vertical is-2"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'right',
            
            right:'auto'
          }}
      
        >
          
          {metaDataList.map((metaData, index) => {
            var image = metaData.image
            console.log(image)
            return (
              <div
                className='meta-card'
              >
                 
                
              <figure>
                <img
                  src={metaData.image}
                  className="card-img"
                  

                ></img>
                <figcaption>{metaData.description}</figcaption>
               </figure>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '10px',
                  }}
                >
                  {isPlay[index] == 'loading' ?
                    <div className='icon-wrapper'>
                      <img src={loader} className="play-icon" />
                    </div> : isPlay[index] == "playing" ?
                      <div className='icon-wrapper' onClick={() => stopPlay(index)}>
                        <img src={pause} className="play-icon" />
                      </div> :
                      <button className='icon-wrapper' content="token revenue" onClick={() => listenMusic(metaData.animation_url, index)}>
                        <b> { NFTaudioclip.methods.RevenueGenerated} </b>
                        <img src={play} className="play-icon" />
                       
                      </button>
                      
                      
                      
                  }
                  <audio src={metaData.animation_url} ref={audioRef} />
                  <p>Profit: {profit[index]} ether</p>
                </div>
               
                  
              </div>
            )
          })}
          </div>
        </div>
      </div>
     
  )


 



}

export default App

