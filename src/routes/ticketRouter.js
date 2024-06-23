import { Router } from "express";
import { ControllerTicket } from "../controller/ticketController.js";

const route = Router()
const controller = new ControllerTicket()

route.post('/purchase', controller.newTicket)

export default route
