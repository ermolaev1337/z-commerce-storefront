"use client"

import {Order} from "@medusajs/medusa"
import {Text, Button} from "@medusajs/ui"
import * as process from "process";

type OrderDetailsProps = {
    order: Order
    showStatus?: boolean
}

const OrderDetails = ({order, showStatus}: OrderDetailsProps) => {
    const formatStatus = (str: string) => {
        const formatted = str.split("_").join(" ")

        return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
    }

    const redirectToSelectedDelivery = () => {
        const deliveryUrl = "http://localhost:1337?id=" + order.id
        console.debug("deliveryUrl", deliveryUrl)
        window.open(deliveryUrl, '_blank');
    };

    return (
        <div>
            <Button onClick={redirectToSelectedDelivery} className="mb-6">Proof of Address</Button>
            <Text className="mt-2">
                Order date: {new Date(order.created_at).toDateString()}
            </Text>
            <Text className="mt-2 text-ui-fg-interactive">
                Order number: {order.display_id}
            </Text>

            <div className="flex items-center text-compact-small gap-x-4 mt-4">
                {showStatus && (
                    <>
                        <Text>
                            Order status:{" "}
                            <span className="text-ui-fg-subtle ">
                {formatStatus(order.fulfillment_status)}
              </span>
                        </Text>
                        <Text>
                            Payment status:{" "}
                            <span className="text-ui-fg-subtle ">
                {formatStatus(order.payment_status)}
              </span>
                        </Text>
                    </>
                )}
            </div>
        </div>
    )
}

export default OrderDetails
