import React, { useMemo, useState, useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, Typography } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { pink } from '@mui/material/colors';


// edit branch

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
  const [ isEditEventOpen, setIsEditEventOpen ] = useState(false)
  const [ subjectEvent, setSubjectEvent ] = useState({title: '', start: '', end: ''})


  // Open / Close Function ---------------------------------------------
  const hdcNewEventClose = () => {
    setIsEditEventOpen(false);
  }
  // Open / Close Function ---------------------------------------------


  // handleValueChange Function -----------------------------------------
  const handleValueChange = (e) => {
    const keyValue = e.target.id;
    const editCopy = {...subjectEvent, [keyValue]: e.target.value };
    setSubjectEvent(editCopy);
  }
  // handleValueChange Function -----------------------------------------



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
      console.log(start.getFullYear())
      console.log(start.getMonth() + 1)
      console.log(start.getDate())
      const newstart = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const title = window.prompt(`New Event name`)
      if (title) {
        setMyEvents((prev) => [...prev, { start: newstart, end: newstart, title, id: genEvID(), sourceResource:'', allDay:'true' }])
      }
    },
    [genEvID]
  )


  // event 확인 ---------------------------------------------
  const handleSelectEvent = useCallback(
    (event) => window.alert(event.end),
    []
  )


  // 수정 Dialog 창 열기 ------------------------------------
  const editEventDialogOpen = useCallback((event, e) => {
    setSubjectEvent(event)

    setMyEvents((prev) => {
      const existing = prev.find((ev) => ev.id === event.id) ?? {}
      const filtered = prev.filter((ev) => ev.id !== event.id)
      return [...filtered, { ...existing, sourceResource: 'userID' }]
    })   
    
    setIsEditEventOpen(true);
  },[])
  // 수정 Dialog 창 열기 ------------------------------------



  // event 수정하기 -------------------------------------
  const editEvent = useCallback(() => {                  // click을 하면 일정만 날아옴
    setMyEvents((prev) => {
      const existing = prev.find((ev) => ev.id === subjectEvent.id) ?? {}
      const filtered = prev.filter((ev) => ev.id !== subjectEvent.id)
      return [...filtered, { ...existing, title: subjectEvent.title, sourceResource: '' }]
    })
    setIsEditEventOpen(false);
    }, 
    [subjectEvent]
  )


  // event 삭제 -------------------------------------
  const deleteEvent = useCallback(() => {                  // click을 하면 일정만 날아옴
    setMyEvents((prev)=> {
      return prev.filter((ev) => ev.id !== subjectEvent.id)
    })
    setIsEditEventOpen(false);
    }, 
    [subjectEvent]
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
      onSelectEvent={editEventDialogOpen}
      // onSelectEvent={handleSelectEvent}
      onSelectSlot={handleSelectSlot}
      onEventDrop={moveEvent}
      onEventResize={resizeEvent}
      draggableAccessor={(event) => true}
      selectable
      popup
      resizable
      showAllEvents
      />

    <Dialog open={isEditEventOpen} onClose={hdcNewEventClose}>
      <DialogTitle sx={{color: pink[500], fontWeight: '400', display: 'flex', alignItems: 'center'}}>
        <ReportIcon sx={{mr: 1}}/>일정 삭제 확인
      </DialogTitle>
      <Divider />       
      <DialogContent>
        <Typography variant="h8">해당 일정을 삭제할까요 ?</Typography>
        
        {/* <TextField value={subjectEvent.title} id="title" label="일정 title" onChange={handleValueChange} margin="dense" type="text" fullWidth variant="standard" />  */}
      </DialogContent>
      <DialogActions>
        <Button onClick={hdcNewEventClose}>Cancel</Button>
        {/* <Button onClick={editEvent}>수정</Button>           */}
        <Button onClick={deleteEvent}>delete</Button>          
      </DialogActions>
    </Dialog>

    </Container>
    
    

    

    
    </>
  )  
}

export default MyCalendar