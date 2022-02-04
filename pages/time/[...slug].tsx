import { TimeIcon, RepeatClockIcon, ViewOffIcon, ViewIcon, MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonGroup, Heading, IconButton, Input, InputGroup, InputLeftElement, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tooltip, useColorMode, useDisclosure, Text, Editable, EditableInput, EditablePreview } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import TimeField from 'react-simple-timefield';
import React from 'react'
import { MdPlayArrow, MdPause } from "react-icons/md";
import { useTimer } from 'use-timer';
import Head from 'next/head';
import useSound from 'use-sound';
import { useRouter } from 'next/router';

// @ts-ignore
const Home: NextPage = ({ slug }) => {
  let [toolbar, setToolbar] = useState(true)
  const [play, { stop }] = useSound('/timer_end.mp3');
  const router = useRouter()
  const valid = /^\d{1,2}$/g
  const { colorMode, toggleColorMode } = useColorMode()

  function hideToolbar() {
    setToolbar(false)
  }

  function showToolbar() {
    setToolbar(true)
  }

  function timerEnd() {
    play()
  }

  const [userValue, setUserValue] = useState(slug.join(':'))

  function toSeconds(time: string) {
    var hms = '00:' + time
    var a = hms.split(':');
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    return seconds
  }

  const handleKeyDown = (event: { key: string; }) => {
    if (event.key === 'Enter') {
      let proc = userValue.replace(':', '/')
      if (typeof window !== "undefined") {
        window.location.assign(`/time/${proc}`)
      }
    }
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [num, setNum] = useState(3)

  const { time, start, pause, reset, status } = useTimer({ initialTime: toSeconds(slug.join(':')), timerType: "DECREMENTAL", endTime: 0, onTimeOver: () => timerEnd() });

  return (
    <div>
      <Head>
        <title>{new Date(time * 1000).toISOString().substr(14, 5)} remaining</title>
      </Head>
      <Box position="fixed" transform="translate(-50%, -50%)" left="50%" top="50%">
        <Heading size="4xl">
          {new Date(time * 1000).toISOString().substr(14, 5)}
        </Heading>
      </Box>
      <ButtonGroup p={2} borderRadius={8} position="fixed" left={10} bottom={10} hidden={toolbar}>
        <Tooltip label="Show toolbar">
          <IconButton
            colorScheme="blue"
            variant="ghost"
            aria-label="Search database"
            icon={<ViewIcon />}
            onClick={showToolbar}
          />
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup p={2} borderRadius={8} position="fixed" transform="translate(-50%, 0)" left="50%" bottom={10} hidden={!toolbar}>
        <Tooltip label={status !== 'RUNNING' ? 'Start timer' : 'Pause timer'}>
          <IconButton
            colorScheme="blue"
            aria-label="Search database"
            icon={status === 'RUNNING' ? <MdPause /> : <MdPlayArrow />}
            onClick={status !== 'RUNNING' ? start : pause}
          />
        </Tooltip>
        <Tooltip label="Press enter to submit">
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <TimeIcon color={colorMode === 'light' ? 'blue.600' : 'blue.200'} />
            </InputLeftElement>
            <TimeField input={<Input size="lg" variant="flushed" textAlign="center" onKeyDown={handleKeyDown} />} onChange={(e) => { setUserValue(e.target.value); reset() }} value={userValue} />
          </InputGroup>
        </Tooltip>
        <Tooltip label='Reset timer'>
          <IconButton
            colorScheme="blue"
            variant="ghost"
            aria-label="Search database"
            icon={<RepeatClockIcon />}
            onClick={reset}
          />
        </Tooltip>
        <Menu>
          <MenuButton as={IconButton} variant="ghost" icon={<HamburgerIcon />} colorScheme="blue" />
          <MenuList>
            <MenuItem onClick={toggleColorMode}>Toggle theme</MenuItem>
            <MenuItem onClick={hideToolbar}>Hide toolbar</MenuItem>
            <MenuItem onClick={() => router.push('https://id.jacob.omg.lol')}>Manage JHQ ID</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onOpen}>Donate to JacobHQ</MenuItem>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Heading>{num}</Heading>
                  <Text>{num > 1 ? 'coffees' : 'coffee'}</Text>
                  <Slider aria-label='slider-ex-1' defaultValue={3} min={1} max={10} onChange={(val) => setNum(val)}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                  </Slider>
                </ModalBody>

                <ModalFooter>
                  <ButtonGroup>
                    <Link href={`https://buy.jacob.omg.lol/donate/${num}`} _hover={{ testDecoration: 'none' }}>
                      <Button colorScheme="blue">Donate {num} {num > 1 ? 'coffees' : 'coffee'}</Button>
                    </Link>
                  </ButtonGroup>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </MenuList>
        </Menu>
      </ButtonGroup>
    </div>
  )
}

export default Home

export const getServerSideProps = async (context: { query: { slug: any; }; }) => {
  var { slug } = context.query;
  // If slug is "undefined", since "undefined" cannot be serialized, server will throw error
  // But null can be serializable
  if (!slug) {
    slug = null;
  }
  // now we are passing the slug to the component
  return { props: { slug: slug } };
};
