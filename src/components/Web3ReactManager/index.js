import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

import { network } from '../../connectors';
import { useEagerConnect, useInactiveListener } from '../../hooks';
import { NetworkContextName } from '../../constants';
import Loader from '../Loader';

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.primary5 || 'white'};
`

export default function Web3ReactManager({ children }) {
  const { active, activate } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  const [walletConnected, setWalletConnected] = useState(false)

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate it
  useEffect(() => {
    // Commented out automatic connection
    // if (triedEager && !networkActive && !networkError && !active) {
    //   activateNetwork(network)
    // }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  const handleConnectWallet = () => {
    activateNetwork(network)
    setWalletConnected(true)
  }

  useInactiveListener(!triedEager)

  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  if (!triedEager) {
    return null
  }

  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>Unknown Error</Message>
      </MessageWrapper>
    )
  }

  if (!active && !networkActive && !walletConnected) {
    return (
      <MessageWrapper>
        <div>
          <button onClick={handleConnectWallet}>Connect Wallet</button>
        </div>
      </MessageWrapper>
    )
  }

  return <>{children}</>
}
