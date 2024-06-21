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
import {useState} from "react"
import ErrorMessage from "../error-message"
import compareAddresses from "@lib/util/compare-addresses"
import { Button } from "@medusajs/ui"

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
                    <Button onClick={()=>setPoa(true)} className="mb-6">Proof of Age</Button>
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
