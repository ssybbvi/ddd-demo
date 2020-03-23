import { PaymentOrderUseCase } from "./paymentOrderUseCase";
import { orderRepo } from "../../repos";
import { fundAccountRepo } from "../../../funds/repos";
import { PaymentOrderController } from "./paymentOrderController";


const paymentOrderUseCase = new PaymentOrderUseCase(orderRepo, fundAccountRepo)
const paymentOrderController = new PaymentOrderController(paymentOrderUseCase)

export { paymentOrderUseCase, paymentOrderController }