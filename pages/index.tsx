import { TimeIcon, RepeatClockIcon, ViewOffIcon, ViewIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonGroup, Heading, IconButton, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useState } from 'react'
import TimeField from 'react-simple-timefield';
import React from 'react'
import { MdPlayArrow, MdPause } from "react-icons/md";
import { useTimer } from 'use-timer';
import Head from 'next/head';
import useSound from 'use-sound';

const Home: NextPage = () => {
  let [toolbar, setToolbar] = useState(true)
  const [play, { stop }] = useSound('/timer_end.mp3');

  function hideToolbar() {
    setToolbar(false)
  }

  function showToolbar() {
    setToolbar(true)
  }

  function timerEnd() {
    play()
  }

  const [userValue, setUserValue] = useState('01:00')

  function toSeconds(time: string) {
    var hms = '00:' + time
    var a = hms.split(':');
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    return seconds
  }

  const { time, start, pause, reset, status } = useTimer({ initialTime: toSeconds(userValue), timerType: "DECREMENTAL", endTime: 0, onTimeOver: () => timerEnd() });

  return (
    <div>
      <Head>
        <title>{time} remaining</title>
      </Head>
      <Box position="fixed" transform="translate(-50%, -50%)" left="50%" top="50%">
        <Heading size="4xl">
          {time}
        </Heading>
      </Box>
      <ButtonGroup p={2} borderWidth="1px" borderRadius={8} position="fixed" left={10} bottom={10} hidden={toolbar}>
        <IconButton
          colorScheme="blue"
          variant="ghost"
          aria-label="Search database"
          icon={<ViewIcon />}
          onClick={showToolbar}
        />
      </ButtonGroup>
      <ButtonGroup p={2} borderWidth="1px" borderRadius={8} position="fixed" transform="translate(-50%, 0)" left="50%" bottom={10} hidden={!toolbar}>
        <IconButton
          colorScheme="blue"
          aria-label="Search database"
          icon={status === 'RUNNING' ? <MdPause /> : <MdPlayArrow />}
          onClick={status !== 'RUNNING' ? start : pause}
        />
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <TimeIcon color='blue.600' />
          </InputLeftElement>
          <TimeField input={<Input size="lg" variant="flushed" textAlign="center" />} onChange={(e) => { setUserValue(e.target.value); reset() }} value={userValue} />
        </InputGroup>
        <IconButton
          colorScheme="blue"
          variant="ghost"
          aria-label="Search database"
          icon={<RepeatClockIcon />}
          onClick={reset}
        />
        <IconButton
          colorScheme="blue"
          variant="ghost"
          aria-label="Search database"
          icon={<ViewOffIcon />}
          onClick={hideToolbar}
        />
      </ButtonGroup>
    </div>
  )
}

export default Home
