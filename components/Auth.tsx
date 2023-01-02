import { useState, useEffect, useRef } from "react"
import SocialLogin from '@biconomy/web3-auth'
import {ChainId} from '@biconomy/core-types'
import SmartAccount  from '@biconomy/smart-account'
import {ethers} from 'ethers'
import {css} from '@emotion/css'

export default function Auth() {
    const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
    const [interval, enableInterval] = useState<boolean>(false)
    const sdkRef = useRef<SocialLogin | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        let configureLogin: any
        if (interval) {
            configureLogin = setInterval(() =>{
                if (!!sdkRef.current?.provider) {
                    setupSmartAccounts()
                    clearInterval(configureLogin)
                }
            }, 1000)

        }
    })

    async function login() {
        if (!sdkRef.current) {
            const socialLoginSDK = new SocialLogin()
            await socialLoginSDK.init(ethers.utils.hexValue(ChainId.POLYGON_MAINNET))
            sdkRef.current = socialLoginSDK
        }

        if (!sdkRef.current.provider) {
            sdkRef.current.showConnectModal()
            sdkRef.current.showWallet()
            enableInterval(true)
        } else {
            setupSmartAccounts()
        }
    }

    async function setupSmartAccounts() {
        if (!sdkRef?.current?.provider) return
        setLoading
        sdkRef.current.hideWallet()
        const web3Provider = new ethers.providers.Web3Provider(
            sdkRef.current.provider
        )
        try {
            const smartAccounts = new SmartAccount(
                web3Provider, {
                    activeNetworkId: ChainId.POLYGON_MAINNET,
                    supportedNetworkIds: [ChainId.POLYGON_MAINNET],
                }
            )
            await smartAccount?.init()
            setSmartAccount(smartAccount)
            setLoading(false)
        } catch (err) {
            console.log('error setting up smart account...', err)
        }


    }
    return (
        <div>

        </div>
    )
}
