import React, { useMemo, useState, useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { pink } from '@mui/material/colors';


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
    // {
    //   id: 0,
    //   start: new Date(2023, 11, 15),
    //   end: new Date(2023, 11, 15),
    //   title: "Sample Event",
    //   sourceResource: '',
    //   allDay: 'true'
    // },
    // {
    //   id: 1,
    //   start: new Date(2023, 11, 12),
    //   end: new Date(2023, 11, 12),
    //   title: "Sample Event2",
    //   sourceResource: '',
    //   allDay: 'true'
    // },
    // // more events...
  ];

  const [ myEvents, setMyEvents ] = useState(events)




  // event별 style -----------------------------------------
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event.color, // 이벤트의 색상을 설정합니다.
      borderRadius: '10px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      width: '150px',
      margin: '0 Auto',
      textAlign: 'center'
    };

    const day = start.getDay();

    if (day === 0 /* 일요일 */) {
      return {
        style: {
          backgroundColor: 'red', // 일요일의 배경색을 여기에 지정하세요
          borderRadius: '10px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block',
          width: '150px',
          margin: '0 Auto',
          textAlign: 'center'
        },
      };
    }

    if (day === 6 /* 토요일 */) {
      return {
        style: {
          backgroundColor: 'blue', // 토요일의 배경색을 여기에 지정하세요
          borderRadius: '10px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block',
          width: '150px',
          margin: '0 Auto',
          textAlign: 'center'
        },
      };
    }

    return {
      style,
    };
  };

  // event id 발생 --------------------------------------------
  const genEvID = useCallback(() => { 
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }  
    return result;
    },[]) 

  // 신규 event 추가 -----------------------------------------
  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt(`New Event title`)
      if (title) {
        setMyEvents((prev) => [...prev, { start, end, title, id: genEvID(), sourceResource:'', allDay:'true', color: 'gray' }])
      }
    },
    [genEvID]
  )

  // event 삭제 ---------------------------------------------
  const handleSelectEvent = useCallback(
    (event) => {
      let result = window.confirm('Evnet를 삭제할까요 ?')
      if(result) {
        setMyEvents((prev)=> {
          return prev.filter((ev) => ev.id !== event.id)
        })
      }
    },[]
  )

  // event 이동 --------------------------------------------------
  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) 
        console.log(`----${existing.title}`)
        const filtered = prev.filter((ev) => ev.id !== event.id) ?? {}
        return [...filtered, { ...existing, start, end, allDay, sourceResource: '' }]
      })
    },
    [setMyEvents]
  )

  // 사이즈 변경 --------------------------------------------------
  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, sourceResource: '' }]
      })
    },
    [setMyEvents]
  )

  // 임시 함수 -----------------------------
  const printEvent =()=> {
    console.log(myEvents)
  }


  return (
    <>
    <Container maxWidth="lg" sx={{height: 500, mt: 5}} >
      <Button onClick={printEvent}>p</Button>
      <DnDCalendar
      views={views}
      localizer={localizer}
      startAccessor="start"
      endAccessor="end"
      events={myEvents}
      showAllEvents      
      selectable
      onEventDrop={moveEvent}
      eventPropGetter={eventStyleGetter}

      onSelectSlot={handleSelectSlot}
      // onSelectEvent={handleSelectEvent}
      onSelectEvent={handleSelectEvent}  
      resizable = {false}
      // popup
      // draggableAccessor={(event) => true}
      // onEventResize={resizeEvent}
      />
    </Container>    
    </>
  )  
}

export default MyCalendar