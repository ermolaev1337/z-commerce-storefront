"use client"


import {
    useSearchParams,
    useRouter,
    usePathname,
    useParams,
} from "next/navigation"
import {Cart, Customer} from "@medusajs/medusa"
import {CheckCircleSolid} from "@medusajs/icons"
import {Heading, Text, useToggleState} from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"

import BillingAddress from "../billing_address"
import ShippingAddress from "../shipping-address"
import {setAddresses} from "../../actions"
import {SubmitButton} from "../submit-button"
import {useFormState} from "react-dom"
import {useState, useEffect} from "react"
import ErrorMessage from "../error-message"
import compareAddresses from "@lib/util/compare-addresses"
import {Button} from "@medusajs/ui"
import medusaError from "@lib/util/medusa-error"

import useWebSocket from 'react-use-websocket';
import axios from 'axios';

const WS_URL = 'ws://localhost:7777';
const CONTROLLER_URL = 'localhost:2222';


const Addresses = ({
                       cart,
                       customer,
                   }: {
    cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
    customer: Omit<Customer, "password_hash"> | null
}) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()

    const countryCode = params.countryCode as string

    const isOpen = searchParams.get("step") === "address"

    const {state: sameAsSBilling, toggle: toggleSameAsBilling} = useToggleState(
        cart?.shipping_address && cart?.billing_address
            ? compareAddresses(cart?.shipping_address, cart?.billing_address)
            : true
    )

    const handleEdit = () => {
        router.push(pathname + "?step=address")
    }

    const [message, formAction] = useFormState(setAddresses, null)

    const [poa, setPoa] = useState(false)


    const handleCheckoutWithWallet = async () => {
        //TODO: maybe we should pass the data related to the items which are about to be purchased
        //TODO: we need to interact with the mdec-controller via digital-wallet's backend (api folder)
        console.debug("CONTROLLER_URL", CONTROLLER_URL)
        const connectionInvitation = await axios.get(`http://${CONTROLLER_URL}/create-order`)
            .catch((error) => {
                medusaError("Create Order (Connection Invitation) error")
                console.error(error);
            });
        //
        //@ts-ignore
        if (connectionInvitation.data){
            //@ts-ignore
            console.debug("connectionInvitation.data", connectionInvitation.data)
            //@ts-ignore
            window.open("http://localhost:19006?data=" + JSON.stringify(connectionInvitation.data), '_blank');
        }

    };

    const {lastMessage} = useWebSocket(WS_URL, {
        onOpen: () => {
            console.debug('WebSocket connection established.');
        },
        onMessage: (msg) => {
            setPoa(true)
            console.debug("msg", msg);
        }
    });

    const [checkoutContent, setCheckoutContent] = useState()//TODO use the data on the e-commerce frontend

    useEffect(() => {
        if (lastMessage) {
            try {
                const content = JSON.parse(lastMessage.data).output.content
                setCheckoutContent(content)
                console.debug("msg.data.output.content", content);
                const data = JSON.parse(lastMessage.data)
                if (data.output && data.output.content) {
                    console.debug("data.output.content", data.output.content)
                    setCheckoutContent(data.output.content)
                    alert(JSON.stringify(data.output.content))
                } else if (data.error) {
                    console.error("data.error", data.error)
                    setCheckoutContent(data)
                    alert(JSON.stringify(data))
                } else {
                    console.error("unknown data format", data)
                }
            }catch (e){
                console.error(e)
            }
        }
    }, [lastMessage])


    return (
        <div className="bg-white">
            <div className="flex flex-row items-center justify-between mb-6">
                <Heading
                    level="h2"
                    className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
                >
                    Proof of Age
                    {!isOpen && <CheckCircleSolid/>}
                </Heading>
                {!isOpen && cart?.shipping_address && (
                    <Text>
                        <button
                            onClick={handleEdit}
                            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                        >
                            Edit
                        </button>
                    </Text>
                )}
            </div>
            {isOpen ? (
                <div>
                    <Button onClick={handleCheckoutWithWallet} className="mb-6">Proof of Age</Button>
                    <form action={formAction}>
                        <div className="pb-8">
                            <ShippingAddress
                                customer={customer}
                                countryCode={countryCode}
                                cart={cart}
                            />
                            <SubmitButton disabled={!poa} className="mt-6">Continue to delivery</SubmitButton>
                            <ErrorMessage error={message}/>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    <div className="text-small-regular">
                        {cart && cart.shipping_address ? (
                            <div className="flex items-start gap-x-8">
                                <div className="flex items-start gap-x-1 w-full">
                                    <div className="flex flex-col w-1/3">
                                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                            Country Code
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.shipping_address.country_code?.toUpperCase()}
                                        </Text>
                                    </div>

                                    <div className="flex flex-col w-1/3 ">
                                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                            Email
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {cart.email}
                                        </Text>
                                    </div>

                                    <div className="flex flex-col w-1/3 ">
                                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                            Proof of Age
                                        </Text>
                                        <Text className="txt-medium text-ui-fg-subtle">
                                            {poa ? "Yes" : "No"}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <Spinner/>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Divider className="mt-8"/>
        </div>
    )
}

export default Addresses
