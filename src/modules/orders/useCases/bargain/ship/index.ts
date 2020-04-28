import { ShipUseCase } from "./shipUseCase";
import { bargainRepo } from "../../../repos";
import { ShipController } from "./shipController";


const shipUseCase = new ShipUseCase(bargainRepo)
const shipController = new ShipController(shipUseCase)

export { shipUseCase, shipController }

