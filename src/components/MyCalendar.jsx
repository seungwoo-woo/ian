import React, { useMemo, useState, useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Container } from '@mui/material';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const DnDCalendar = withDragAndDrop(Calendar)
const localizer = momentLocalizer(moment)


function MyCalendar() {

  // calendar 보기 형식 정의 ---------------------------------------------
  const { views } = useMemo(
    () => ({
      views: ['month'],    // 이걸로 보이는 것 조정 가능 ['month', 'day']
    }),
    []
  )
  // ----------------------------------------------

  const events = [
    {
      id: 0,
      start: new Date(),
      end: new Date(moment().add(1, "days")),
      title: "Sample Event",
    },
    {
      id: 1,
      start: new Date(2023, 10, 11),
      end: new Date(2023, 10, 11),
      title: "Sample Event2",
    },
    // more events...
  ];

  const [myEvents, setMyEvents] = useState(events)

  let maxID = Math.max(...(myEvents.map((ev) => ev.id)))

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt('New Event name')
      if (title) {
        setMyEvents((prev) => [...prev, { start, end, title, id: (maxID + 1) }])
        maxID = maxID + 1
      }
    },
    [setMyEvents]
  )

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.end),
    []
  )

  const deleteEvent = (e) => {                   // click을 하면 일정만 날아옴
    const filtedEvent = myEvents.filter((ev) => ev.id !== e.id)
    setMyEvents(filtedEvent)
  }

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, allDay }]
      })
    },
    [setMyEvents]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
    },
    [setMyEvents]
  )

  const printEvent =()=> {
    console.log(myEvents)
  }




  return (
    <Container maxWidth="lg" sx={{height: 500, mt: 5}} >
      <Button onClick={printEvent}>p</Button>
      <DnDCalendar
      views={views}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      events={myEvents}
      onSelectEvent={deleteEvent}
      onSelectSlot={handleSelectSlot}
      onEventDrop={moveEvent}
      onEventResize={resizeEvent}
      draggableAccessor={(event) => true}
      selectable
      popup
      resizable
      showAllEvents
      />
    </Container>
  )  
}

export default MyCalendar