import './App.css'
import { useState, useEffect } from 'react'
import { MantineProvider, Button, Container, Checkbox, Stack, MultiSelect, Accordion, TextInput, Text, Title, Chip } from '@mantine/core';
import { FriendshipEdition, BreakupEdition, HonestDatingEdition, CouplesEdition , CustomEdition} from './assets/Cards'
import { useViewportSize, useHotkeys } from '@mantine/hooks';
import moment from 'moment/moment';
import { useSwipeable } from 'react-swipeable';

let totalDeck = [...FriendshipEdition, ...BreakupEdition, ...HonestDatingEdition, ...CouplesEdition, ...CustomEdition]

function App() {
  const handlers = useSwipeable({
    onSwipedDown: (eventData) => console.log("User Swiped!", eventData),
    ...config,
  });

  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentDeck, setCurrentDeck] = useState([])
  const [deckSettings, setDeckSettings] = useState({
    DeckUsed: {
      FriendshipEdition: false,
      BreakupEdition: false,
      HonestDatingEdition: false,
      CouplesEdition: false,
      CustomEdition: false
    },
    Levels: {
      1: true,
      2: true,
      3: true,
      noLevels: true
    },
    MiscRules: {
      includeWildCards: false,
      includeReminders: false,
      trackCardsUsed: true,
    },
  })
  const [cardHistory, setCardHistory] = useState([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardText, setCardText] = useState("")
  const [showSetting, setShowSettings] = useState(true)

  // changes DeckSettings when settings are changed
  useEffect(() => {
    // console.log("deckSettings has been changed", {deckSettings})
    let tempDeck = []
    // Deck Editions
    if (deckSettings.DeckUsed.FriendshipEdition) tempDeck.push(...FriendshipEdition)
    if (deckSettings.DeckUsed.BreakupEdition) tempDeck.push(...BreakupEdition)
    if (deckSettings.DeckUsed.HonestDatingEdition) tempDeck.push(...HonestDatingEdition)
    if (deckSettings.DeckUsed.CouplesEdition) tempDeck.push(...CouplesEdition)
    if (deckSettings.DeckUsed.CustomEdition) tempDeck.push(...CustomEdition)

    let useDeck = []
    if (tempDeck && tempDeck.length > 0) {
      for (let card of tempDeck) {
        if (!deckSettings.MiscRules.includeWildCards && card && card.Type === "Wildcard") continue
        if (!deckSettings.MiscRules.includeReminders && card && card.Type === "Reminder") continue
        if (deckSettings.Levels["1"] && card && card.Level == 1) useDeck.push(card)
        if (deckSettings.Levels["2"] && card && card.Level == 2) useDeck.push(card)
        if (deckSettings.Levels["3"] && card && card.Level == 3) useDeck.push(card)
        if (deckSettings.Levels["noLevels"] && card && !card.Level) useDeck.push(card)
      }
    }

    setCurrentDeck(useDeck)
  }, [deckSettings])


  //Password to enter site
  useEffect(() => {
    let testpassword = password.toLowerCase()
    // if (testpassword == "   ") {
      if (testpassword == "and i will allow us to be") {
      setLoggedIn(true)
    }
  }, [password])

  //keyPressed handerlers 
  useHotkeys([
    ['`', () => { setShowSettings(!showSetting) }],
    ['space', () => pressSpacebar()],
    ['enter', () => pressSpacebar()],
    ['tab', () => pressSpacebar()],
    ['mod+J', () => console.log('Toggle color scheme')],
    ['escape', () => handleClear()],
    ['backspace', () => handleClear()],
    ['ctrl+K', () => console.log('Trigger search')],
    ['ctrl+A', (e) => pressA(e)],
  ]);

  // Event Handlers for button pressed 

  const pressA = (e) => {
    console.log("Pressed A :", moment().format('MMMM Do YYYY, h:mm:ss a'));
    e.preventDefault()
    e && e.stopPropogation && e.stopPropogation()
  }

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
    for (let card of totalDeck) {
      if (card.id == id) {
        setCardText(card)
      }
    }
  }

  const flipCard = () => { setIsFlipped(!isFlipped) }

  // Handlers

  const handleClick = () => {
    const randomCard = Math.floor(Math.random() * currentDeck.length)
    if (!cardText || !isFlipped) {
      setCardText(currentDeck[randomCard])
      return
    }
    setIsFlipped(false)
    setTimeout(() => {
      if (deckSettings.MiscRules["trackCardsUsed"]) {
        let tempList = cardHistory
        let pulledCard = currentDeck[randomCard]
        // console.log({pulledCard})
        tempList.push(pulledCard.id)
        setCardHistory(tempList)
      }
      setCardText(currentDeck[randomCard])
    }, 1500)
  }

  const handleClear = () => {
    setCardText('')
  }

  const handleDeckSettings = (stringChange, stringType) => {
    let deckClone = JSON.parse(JSON.stringify(deckSettings))
    if (stringType == "deck") {
      if (stringChange == "Friendship") { deckClone.DeckUsed.FriendshipEdition = !deckClone.DeckUsed.FriendshipEdition }
      else if (stringChange == "Breakup") { deckClone.DeckUsed.BreakupEdition = !deckClone.DeckUsed.BreakupEdition }
      else if (stringChange == "HonestDating") { deckClone.DeckUsed.HonestDatingEdition = !deckClone.DeckUsed.HonestDatingEdition }
      else if (stringChange == "Couples") { deckClone.DeckUsed.CouplesEdition = !deckClone.DeckUsed.CouplesEdition }
      else if (stringChange == "Custom") { deckClone.DeckUsed.CustomEdition = !deckClone.DeckUsed.CustomEdition }
    }
    if (stringType == "levels") {
      if (stringChange == "1") { deckClone.Levels["1"] = !deckClone.Levels["1"] }
      if (stringChange == "2") { deckClone.Levels["2"] = !deckClone.Levels["2"] }
      if (stringChange == "3") { deckClone.Levels["3"] = !deckClone.Levels["3"] }
      if (stringChange == "noLevels") { deckClone.Levels["noLevels"] = !deckClone.Levels["noLevels"] }
    }
    if (stringType == "miscRules") {
      if (stringChange == "trackCards") { deckClone.MiscRules.trackCardsUsed = !deckClone.MiscRules.trackCardsUsed }
      if (stringChange == "includeWild") { deckClone.MiscRules.includeWildCards = !deckClone.MiscRules.includeWildCards }
      if (stringChange == "includeReminders") { deckClone.MiscRules.includeReminders = !deckClone.MiscRules.includeReminders }
    }
    setDeckSettings(deckClone)
  }

  // render 
  const renderCardHistory = () => {
    return (
      <div>
        <div />
        {cardHistory.map((id) => { return <Button p="xs" m="5px" key={id} onClick={() => { setCardHistoryText(id) }}>{id}</Button> })}
      </div>
    )
  }

  const renderDeckSettings = (
    <Container
      className={`deck-settings ${showSetting ? "reveal" : ""}`}
      sx={{ backgroundColor: '#656565', width: '300px', left: 30, borderRadius: '10px' }} p="xs">

      <Stack sx={{ width: '300px' }}>
        <Title>
          Deck Settings
        </Title>
        <Accordion defaultValue="customization">
          <Accordion.Item value="Editions">
            <Accordion.Control><Text color="white">Editions </Text></Accordion.Control>
            <Accordion.Panel >
              <Chip color="green" checked={deckSettings.DeckUsed.CustomEdition} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("Custom", "deck") }}>Core</Chip>
              <Chip color="green" checked={deckSettings.DeckUsed.FriendshipEdition} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("Friendship", "deck") }}>Friendship</Chip>
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
                <Chip color="green" checked={deckSettings.Levels["2"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("2", "levels") }} >Level 2</Chip>
                <Chip color="green" checked={deckSettings.Levels["3"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("3", "levels") }}  >Level 3</Chip>
                <Chip color="green" checked={deckSettings.Levels["noLevels"]} variant={"filled"} mb="xs" onChange={() => { handleDeckSettings("noLevels", "levels") }}  >No Levels</Chip>
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
              {deckSettings.MiscRules["trackCardsUsed"] && <Button color="red" onClick={() => { setCardHistory([]) }}>Reset Tracked List</Button>}
              <br />
              {cardHistory.length} Cards
              <Container mt={10} sx={{ overflowY: 'scroll', overflowX: 'hidden', width: 270, maxHeight: 300 }} m={0} p={0}>{renderCardHistory()}</Container>
            </Accordion.Panel>
          </Accordion.Item>}

        </Accordion>


        Current Card Count: {currentDeck.length}
      </Stack>
    </Container>
  )

  const pulledCard = (
    <Container
      className={`card ${isFlipped ? "flipped" : ""}`}
      onClick={() => flipCard()}
      sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', zIndex: 0, cursor: 'pointer', }}>

      <Container className="content">
        <Container className="front">
          <Title
            sx={{ alignContent: 'center', position: 'relative', left: 45 }}
            order={4} color="white"> WE ARE ONLY HUMAN </Title>
        </Container>

        <Container className={`back ${cardText.Type == "Wildcard" ? "wildcard" : ""}`}>

          {cardText && cardText.Level && <Text
            sx={{ color: 'red', fontWeight: 500, paddingTop: 5, position: 'absolute', top: '3%' }}
          > Level: {cardText.Level && cardText.Level}</Text>}

          <Text
            sx={{ color: 'red', fontWeight: 600, justifyContent: 'center', display: 'flex', alignItems: 'center', position: 'absolute', top: '50%', maxWidth: 280, height: 0 }}
          >
            {cardText && cardText.Question}
          </Text>


          {cardText && cardText.Edition && <Text
            sx={{ color: 'red', fontWeight: 500, position: 'absolute', bottom: '3%', fontSize: 12, }}
          > {cardText.Edition == 'HonestDating' ? "Honest Dating" : cardText.Edition == 'Breakup' ? "Breakup" : cardText.Edition == 'Friendship' ? "Friendship" : cardText.Edition == 'Couples' ? "Couples" : "Core"} Edition </Text>}


        </Container>

      </Container>
    </Container>
  )

  return (
    <MantineProvider
      // withGlobalStyles 
      withNormalizeCSS
      theme={{ colorScheme: 'dark' }}>

      <div className="App" {...handlers}>
        {!loggedIn && <TextInput placeholder='we are only human'
          value={password} onChange={(event) => { setPassword(event.target.value) }} ></TextInput>}

        {loggedIn && renderDeckSettings}

        <div />
        {loggedIn && <div style={{ position: 'absolute', bottom: cardText ? 10 : 500, left: '45%', transition: 'bottom .2s ease' }}>
          {currentDeck.length > 0 ?
            <Button color="red" onClick={() => handleClear()} sx={{ position: 'absolute', left: cardText ? 200 : 0, transition: 'left .5s ease' }}>Clear</Button> : null}

          {currentDeck.length > 0 ?
            <Button onClick={() => handleClick()} > Deal A Random Card </Button> : "There are no cards in the deck"}

        </div>}

        <div/>

        {!cardText && !pulledCard && "There is no current Card"}
        {cardText && pulledCard}

      </div>
    </MantineProvider>
  )
}

export default App
