import { Controller, Get, Param } from "@nestjs/common";
import { PublicService } from "./public.service";

@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("tables/:publicCode/bill")
  getBillByTableQr(@Param("publicCode") publicCode: string) {
    return this.publicService.getBillByTableQr(publicCode);
  }
}