import './App.css'
import { useState, useEffect } from 'react'
import {  MantineProvider,Button,Container,Checkbox ,Stack, MultiSelect,Accordion, TextInput,  Text, Title,Chip} from '@mantine/core';
import {FriendshipEdition, BreakupEdition, HonestDatingEdition, CouplesEdition } from './assets/Cards'
import { useViewportSize , useHotkeys } from '@mantine/hooks';

let totalDeck = [...FriendshipEdition, ...BreakupEdition, ...HonestDatingEdition, ...CouplesEdition]

function App() {
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentDeck, setCurrentDeck] = useState([])
  const [deckSettings, setDeckSettings] = useState({
    DeckUsed: {
      FriendshipEdition: false,
      BreakupEdition: false,
      HonestDatingEdition: false,
      CouplesEdition: false
    }, 
    Levels: {
      1:true, 
      2:true, 
      3:true,
      noLevels: true
    }, 
    MiscRules: {
      includeWildCards: true , 
      includeReminders: true ,
      trackCardsUsed: true ,
    },
  })
  const [cardHistory, setCardHistory] = useState([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardText, setCardText] = useState("")
  const [showSetting, setShowSettings] = useState(true)
  
  useEffect(()=>{
    console.log("deckSettings has been changed", {deckSettings})
    let tempDeck = []
    // Deck Editions
    if (deckSettings.DeckUsed.FriendshipEdition) tempDeck.push(...FriendshipEdition)
    if (deckSettings.DeckUsed.BreakupEdition) tempDeck.push(...BreakupEdition)
    if (deckSettings.DeckUsed.HonestDatingEdition) tempDeck.push(...HonestDatingEdition)
    if (deckSettings.DeckUsed.CouplesEdition) tempDeck.push(...CouplesEdition)

    let useDeck = []
    if (tempDeck && tempDeck.length > 0) {
      for (let card of tempDeck){
        if (deckSettings.Levels["1"] && card&& card.Level == 1)useDeck.push(card)
        if (deckSettings.Levels["2"] && card && card.Level == 2)useDeck.push(card)
        if (deckSettings.Levels["3"] && card && card.Level == 3)useDeck.push(card)
        if (deckSettings.Levels["noLevels"] && card && !card.Level)useDeck.push(card)
      }

    }


    setCurrentDeck(useDeck)
  }, [deckSettings])

  useEffect(()=>{
    
    let testpassword = password.toLowerCase()
    if(testpassword == "and i will allow us to be") {
      setLoggedIn(true)
    }
  },[password])
  useHotkeys([
    ['`', () => {setShowSettings(!showSetting)}],
    ['space', () => pressSpacebar()],
    ['enter', () => pressSpacebar()],
    ['tab', () => pressSpacebar()],
    ['mod+J', () => console.log('Toggle color scheme')],
    ['escape', () => handleClear()],
    ['backspace', () => handleClear()],
    ['ctrl+K', () => console.log('Trigger search')],
  ]);

  const pressSpacebar = () => {
    if (!isFlipped) {
      setIsFlipped(true)
      return
    }
    if (isFlipped) {
      handleClick()
      return
    }
  }
  const setCardHistoryText = (id) => {
    for (let card of totalDeck){
      if (card.id == id) {
        setCardText(card)
      }
    }
  }

  const flipCard = () => { setIsFlipped(!isFlipped) }

  const handleClick = () =>{
    const randomCard =  Math.floor(Math.random() * currentDeck.length)
    if (!cardText || !isFlipped){
      setCardText(currentDeck[randomCard])
      return
    }
    setIsFlipped(false)
    setTimeout(()=>{
      if(deckSettings.MiscRules["trackCardsUsed"]){
        let tempList = cardHistory
        let pulledCard = currentDeck[randomCard]
        // console.log({pulledCard})
        tempList.push(pulledCard.id) 
        setCardHistory(tempList)
      }
      setCardText(currentDeck[randomCard])
    },1500)
  }

  const handleClear = () => {
    setCardText('')
  }

  const handleDeckSettings = (stringChange , stringType) =>{
    if (stringType == "deck"){
      if (stringChange == "Friendship") {
        setDeckSettings({ DeckUsed: { 
          FriendshipEdition: !deckSettings.DeckUsed.FriendshipEdition,
          BreakupEdition: deckSettings.DeckUsed.BreakupEdition,
          HonestDatingEdition: deckSettings.DeckUsed.HonestDatingEdition,
          CouplesEdition: deckSettings.DeckUsed.CouplesEdition, },
          Levels: { ...deckSettings.Levels }, MiscRules: { ...deckSettings.MiscRules } })
        }
      else if (stringChange == "Breakup") {
        setDeckSettings({ DeckUsed: { 
          FriendshipEdition: deckSettings.DeckUsed.FriendshipEdition,
          BreakupEdition: !deckSettings.DeckUsed.BreakupEdition,
          HonestDatingEdition: deckSettings.DeckUsed.HonestDatingEdition,
          CouplesEdition: deckSettings.DeckUsed.CouplesEdition, },
          Levels: { ...deckSettings.Levels }, MiscRules: { ...deckSettings.MiscRules } })
        }
      else if (stringChange == "HonestDating") {
        setDeckSettings({ DeckUsed: { 
          FriendshipEdition: deckSettings.DeckUsed.FriendshipEdition,
          BreakupEdition: deckSettings.DeckUsed.BreakupEdition,
          HonestDatingEdition: !deckSettings.DeckUsed.HonestDatingEdition,
          CouplesEdition: deckSettings.DeckUsed.CouplesEdition, },
          Levels: { ...deckSettings.Levels }, MiscRules: { ...deckSettings.MiscRules } })
        }
      else if (stringChange == "Couples") {
        setDeckSettings({ DeckUsed: { 
          FriendshipEdition: deckSettings.DeckUsed.FriendshipEdition,
          BreakupEdition: deckSettings.DeckUsed.BreakupEdition,
          HonestDatingEdition: deckSettings.DeckUsed.HonestDatingEdition,
          CouplesEdition: !deckSettings.DeckUsed.CouplesEdition, },
          Levels: { ...deckSettings.Levels }, MiscRules: { ...deckSettings.MiscRules } })
        }
    }
    if (stringType == "levels"){
      if (stringChange == "1"){ 
        setDeckSettings({
          DeckUsed: {...deckSettings.DeckUsed },
          Levels: { 
            1: !deckSettings.Levels["1"], 
            2: deckSettings.Levels["2"],
            3: deckSettings.Levels["3"],
            "noLevels": deckSettings.Levels["noLevels"]
          }, MiscRules: {...deckSettings.MiscRules}})
      }
      if (stringChange == "2"){ 
        setDeckSettings({
          DeckUsed: {...deckSettings.DeckUsed },
          Levels: { 
            1: deckSettings.Levels["1"], 
            2: !deckSettings.Levels["2"],
            3: deckSettings.Levels["3"],
            "noLevels": deckSettings.Levels["noLevels"]
          }, MiscRules: { ...deckSettings.MiscRules }
})
      }
      if (stringChange == "3"){ 
        setDeckSettings({
          DeckUsed: {...deckSettings.DeckUsed },
          Levels: { 
            1: deckSettings.Levels["1"], 
            2: deckSettings.Levels["2"],
            3: !deckSettings.Levels["3"],
            "noLevels": deckSettings.Levels["noLevels"]
          }, MiscRules: { ...deckSettings.MiscRules }
})
      }
      if (stringChange == "noLevels"){ 
        setDeckSettings({
          DeckUsed: {...deckSettings.DeckUsed },
          Levels: { 
            1: deckSettings.Levels["1"], 
            2: deckSettings.Levels["2"],
            3: deckSettings.Levels["3"],
            "noLevels":!deckSettings.Levels["noLevels"]
          }, MiscRules: { ...deckSettings.MiscRules }
})
      }
    }
    if (stringType == "miscRules"){
      if (stringChange == "trackCards"){
        setDeckSettings({
          DeckUsed: { ...deckSettings.DeckUsed },
          Levels: { ...deckSettings.Levels },
          MiscRules: {
            includeWildCards: deckSettings.MiscRules.includeWildCards,
            includeReminders: deckSettings.MiscRules.includeReminders,
            trackCardsUsed: !deckSettings.MiscRules.trackCardsUsed,}})
          }
      if (stringChange == "includeWild"){
        setDeckSettings({
          DeckUsed: { ...deckSettings.DeckUsed },
          Levels: { ...deckSettings.Levels },
          MiscRules: {
            includeWildCards: !deckSettings.MiscRules.includeWildCards,
            includeReminders: deckSettings.MiscRules.includeReminders,
            trackCardsUsed: deckSettings.MiscRules.trackCardsUsed,}})
          }
      if (stringChange == "includeReminders"){
        setDeckSettings({
          DeckUsed: { ...deckSettings.DeckUsed },
          Levels: { ...deckSettings.Levels },
          MiscRules: {
            includeWildCards: deckSettings.MiscRules.includeWildCards,
            includeReminders: !deckSettings.MiscRules.includeReminders,
            trackCardsUsed: deckSettings.MiscRules.trackCardsUsed,}})
          }
    }
  }

  const renderCardHistory = () =>{
    return (
    <div>
      <div/>
      {cardHistory.map((id) => { return <Button p="xs" m="5px" key={id} onClick={() => { setCardHistoryText(id)}}>{id}</Button>})}
    </div>
    )
  }

  const renderDeckSettings = (
    <Container
      className = {`deck-settings ${showSetting ? "reveal":""}`}
      sx={{ backgroundColor: '#656565', width: '300px', left: 30, borderRadius: '10px' }} p="xs">

      <Stack  sx={{ width: '300px' }}>
        <Title>
          Deck Settings
        </Title>
        <Accordion defaultValue="customization">
          <Accordion.Item value="Editions">
            <Accordion.Control><Text color="white">Editions </Text></Accordion.Control>
            <Accordion.Panel >
              <Chip color="green" checked={deckSettings.DeckUsed.FriendshipEdition} variant={"filled"} mb="xs" onChange={() => {handleDeckSettings("Friendship", "deck")}}>Friendship</Chip>
              <Chip color="green" checked={deckSettings.DeckUsed.BreakupEdition} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("Breakup", "deck") }}>Breakup</Chip>
              <Chip color="green" checked={deckSettings.DeckUsed.HonestDatingEdition} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("HonestDating", "deck") }}>Honest Dating</Chip>
              <Chip color="green" checked={deckSettings.DeckUsed.CouplesEdition} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("Couples", "deck") }}>Couples</Chip>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="Levels">
            <Accordion.Control><Text color="white">Levels</Text></Accordion.Control>
            <Accordion.Panel>
              <Text color="white">
                <Chip color="green" checked={deckSettings.Levels["1"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("1", "levels") }}>Level 1</Chip>
                <Chip color="green" checked={deckSettings.Levels["2"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("2", "levels")}} >Level 2</Chip>
                <Chip color="green" checked={deckSettings.Levels["3"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("3", "levels")}}  >Level 3</Chip>
                <Chip color="green" checked={deckSettings.Levels["noLevels"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("noLevels", "levels")}}  >No Levels</Chip>
                </Text>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="focus-ring">
            <Accordion.Control><Text color="white">Misc</Text></Accordion.Control>
            <Accordion.Panel>
              <Chip color="green" checked={deckSettings.MiscRules["trackCardsUsed"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("trackCards", "miscRules") }}>Track Cards Used</Chip>
              <Chip color="green" checked={deckSettings.MiscRules["includeWildCards"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("includeWild", "miscRules") }}>Include WildCards</Chip>
              <Chip color="green" checked={deckSettings.MiscRules["includeReminders"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("includeReminders", "miscRules") }}>Include Reminders</Chip>
            </Accordion.Panel>
          </Accordion.Item>

          {deckSettings.MiscRules["trackCardsUsed"] && <Accordion.Item value="card-history">
            <Accordion.Control><Text color="white">Card History</Text></Accordion.Control>
            <Accordion.Panel>
              {deckSettings.MiscRules["trackCardsUsed"] && <Button color="red" onClick = {()=>{setCardHistory([])}}>Reset Tracked List</Button>}
              <br/>
              {cardHistory.length} Cards
              <Container mt={10} sx ={{overflowY:'scroll', overflowX: 'hidden', width:270, maxHeight:300 }}m = {0} p={0}>{renderCardHistory()}</Container>
            </Accordion.Panel>
          </Accordion.Item>}

        </Accordion>


      Current Card Count: {currentDeck.length}
      </Stack>
    </Container>
  )

  const pulledCard = ( 
    <Container 
      className = {`card ${isFlipped ? "flipped": ""}`} 
      onClick ={()=>flipCard()}
      sx={{ display: 'flex', alignContent:'center', justifyContent:'center', zIndex: 0, cursor:'pointer'}}>

      <Container className = "content">
        <Container className = "front">
          <Title 
            sx={{}}
            order ={4} color ="white"> WE ARE ONLY HUMAN </Title>
          </Container>

        <Container className = "back">

            {cardText && cardText.Level && <Text
            sx={{ color: 'red', fontWeight: 500, paddingTop: 5 ,position: 'absolute', top: '3%' }}
            > Level: {cardText.Level && cardText.Level}</Text>}

            <Text
            sx={{ color: 'red', fontWeight: 600, justifyContent: 'center', display: 'flex', alignItems: 'center', position: 'absolute', top: '50%', maxWidth: 280, height: 0 }}
            >
              {cardText&& cardText.Question}
            </Text>


            {cardText &&cardText.Edition && <Text
            sx={{ color: 'red', fontWeight: 500, position: 'absolute', bottom: '3%', fontSize: 12,  }}
            > {cardText.Edition == 'HonestDating' ? "Honest Dating" : cardText.Edition == 'Breakup' ? "Breakup" : cardText.Edition == 'Friendship' ? "Friendship" : cardText.Edition == 'Couples' ? "Couples" : "Extra"} Edition </Text>}


          </Container>

        </Container>
    </Container>
  )

  return (
    <MantineProvider 
      // withGlobalStyles 
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}> 
      <div className="App">
        { !loggedIn && <TextInput placeholder='we are only human'
        value ={password} onChange={(event)=>{setPassword(event.target.value)}} ></TextInput>}
        
        {renderDeckSettings}
      <div/>
      {loggedIn &&<div style={{ position: 'absolute', bottom: cardText?10: 500,left: '45%', transition: 'bottom .2s ease'}}>
    {currentDeck.length > 0 ? 
      <Button color="red" onClick={() => handleClear()}sx={{ position: 'absolute', left: cardText ? 200: 0, transition: 'left .5s ease' }}>Clear</Button>: null}
    {currentDeck.length > 0 ? 
      <Button onClick={() => handleClick()} > Deal A Random Card </Button> : "There are no cards in the deck"}
      </div>}

        
      <div/>

      {cardText && pulledCard}
      


    </div>
    </MantineProvider>
  )
}

export default App
