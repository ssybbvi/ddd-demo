import { AfterAuthCodeCreated } from "./afterAuthCodeCreated";
import { createAppUserUseCase } from "../useCases/appUser/createAppUser";

new AfterAuthCodeCreated(createAppUserUseCase)
