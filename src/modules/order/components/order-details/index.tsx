import {Order} from "@medusajs/medusa"
import {Text} from "@medusajs/ui"
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

    return (
        <div>
            <Text>
                We have sent the order confirmation details to{" "}
                <span className="text-ui-fg-medium-plus font-semibold">
          {order.email}
        </span>
                . To finalize the delivery, <span className={"text-ui-fg-subtle txt-small"}><a
                className={"hover:text-ui-fg-base txt-small-plus"} target={"_blank"}
                href={process.env.DELIVERY_SERVICE_REDIRECTION_ENDPOINT + "?id=" + order.id}>provide the Proof of Address to the delivery service</a></span> right
                now or follow the instruction in the email.
            </Text>
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
